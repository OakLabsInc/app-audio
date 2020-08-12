
const oak = require('oak')
const { join } = require('path')
const _ = require('lodash')
oak.catchErrors()

const express = require('express')
const stylus = require('stylus')
const app = express()

const port = process.env.PORT ? _.toNumber(process.env.PORT) : 9000
const platform = require(join(__dirname, 'platform'))

let publicPath = join(__dirname, 'public')
let viewsPath = join(__dirname, 'views')

let window = null

app.set('views', viewsPath)
app.set('view engine', 'pug')
app.use(stylus.middleware({
  src: viewsPath,
  dest: join(publicPath, 'css')
}))
app.use(express.static(publicPath))

app.listen(port, function () {
  oak.on('ready', () => loadWindow())
})

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/setAlsaCard/:card', function (req, res) {
  var card = req.params['card']
  platform.reinstallApplication(card, window)
  res.send('sent')
})

app.get('/setAlsaCardConfiguration/:json', function (req, response) {
  var json = JSON.parse(req.params['json'])
  console.log(JSON.stringify(json, null, 2))
  platform.configureAudio(json, function (err, res) {
    if (err) throw err
    console.log('configureAudio Done')
  })
  response.send('sent')
})

app.get('/getAudioInfo', function (req, response) {
  platform.getAudioInfo(function (err, res) {
    if (err) throw err
    response.send(res.mixers)
  })
})

app.get('/getAlsaCardFromEnvironment', function (req, response) {
  var card = process.env.ALSA_CARD || 'No Card Selected'
  response.send(card)
})

async function loadWindow () {
  console.log({
    message: `Started on port ${port}`
  })
  window = oak.load({
    url: `http://localhost:${port}/`,
    ontop: false,
    insecure: true,
    flags: ['enable-vp8-alpha-playback'],
    sslExceptions: ['localhost'],
    background: '#000000',
    scripts: [
      {
        name: 'uuid',
        path: 'uuid'
      },
      {
        name: 'lodash',
        path: join(__dirname, '..', 'node_modules', 'lodash')
      },
      join(__dirname, '..', 'node_modules', 'jquery'),
      join(__dirname, '..', 'node_modules', 'angular'),
      join(__dirname, '..', 'node_modules', 'angular-animate'),
      join(__dirname, '..', 'node_modules', 'angular-aria'),
      join(__dirname, '..', 'node_modules', 'angular-messages'),
      join(__dirname, '..', 'node_modules', 'angular-material'),
      join(__dirname, 'public', 'javascript', 'index.js')
    ]
  })
    .on('ready', function () {
      platform.getAudioInfo(function (err, res) {
        if (err) throw err
        console.log('Audio Info', res)
      })
    })
  platform.initPlatform(window)
}
