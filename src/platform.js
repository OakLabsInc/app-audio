
const { join } = require('path')
const OakPlatform = require('@oaklabs/platform')
const oak = require('oak')
const _ = require('lodash')

const YAML = require('yamljs');

var image = ''
let window = null

function initPlatform(win) {
  window = win
}
async function getAudioInfo (cb = function () {}) {
  // open a connection to the platform host
  console.log("PLATFORM_HOST", process.env.PLATFORM_HOST )
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })
  let audio = await platform.audio()

  audio.Info(undefined, cb)
}

async function configureAudio (config, cb = function () {}) {
  // open a connection to the platform host
  console.log("PLATFORM_HOST", process.env.PLATFORM_HOST )
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })
  let audio = await platform.audio()
  audio.Configure(config, cb)
}

async function reinstallApplication (card) {
  let platform = await new OakPlatform({
      host: process.env.PLATFORM_HOST || 'localhost:443'
  })

  let app = await platform.application()

  async function getLiveImageName() {
    return new Promise(async function(resolve, reject) {
      try {
        await app.viewLive(undefined, function (err, res) {
          let services = YAML.parse(res.docker_compose_yaml).services
          let image = services[Object.keys(services)[0]].image
          console.log('- LIVE:', image)
          resolve(image)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  app.install({
    services: [
      {
        image: await getLiveImageName(),
        environment: {
          ALSA_CARD: card,
          NODE_ENV: "production"
        }
      }
    ]
  }, function (err) {
      console.log('- ERROR', err)
  })
  .on('data', function (data) {
    console.log(data.step)
    window.send('installProgress', data)
  })
  .on('end', async function () {
    let message = {
      details: '',
      step: 'DONE INSTALLING'
    }
    window.send('installProgress', message)
    await app.swapIdleAndLive(undefined, async function () {
      let message = {
        details: '',
        step: 'SWAPPED IDLE AND LIVE'
      }
      window.send('installProgress', message)
      await app.viewLive(undefined, function (err, res) {
        let services = YAML.parse(res.docker_compose_yaml).services
        let image = services[Object.keys(services)[0]].image
        console.log('- LIVE:', image)
      })
    })
  })
}
  

module.exports.reinstallApplication = reinstallApplication
module.exports.getAudioInfo = getAudioInfo
module.exports.configureAudio = configureAudio
module.exports.initPlatform = initPlatform



