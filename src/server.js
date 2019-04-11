
const oak = require('oak')
const { join } = require('path')

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
  dest: join(publicPath, "css")
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
  platform.reinstallApplication(card)
  res.send('sent')
})

app.get('/getAudioInfo', function (req, response) {
    platform.getAudioInfo( function(err, res) {
      if(err) throw err
      let idArray = []
      for(var mixer in res.mixers){
        idArray.push(res.mixers[mixer].mixer_id.split(":")[0])
      }
      console.log("idArray: ",[ ...new Set(idArray) ])
      response.send([ ...new Set(idArray) ])
    })
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
    background: '#000000'
  })
  .on('ready', function () {
    platform.getAudioInfo( function(err, res) {
      if(err) throw err

      console.log("Audio Info", res)

    })
  })

}
