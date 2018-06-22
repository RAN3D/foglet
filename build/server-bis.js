const path = require('path')
const FSS = require('foglet-signaling-server')
const fs = require('fs')
const Twilio = require('twilio')
const cors = require('cors')
const express = require('express')
const io = require('socket.io')
const http = require('http')

var corsOptions = {
  origin: 'http://localhost:8000/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

function run (app, log, host = 'localhost', port = 8000) {
  app.use(cors(corsOptions))
  const twilioconfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'twilio_config.json'), 'utf-8'))

  app.get('/ice', function (req, res) {
    console.log('A user want ice from client:')
    try {
      var client = Twilio(twilioconfig.api_key, twilioconfig.api_secret, {accountSid: twilioconfig.sid})
      client.api.account.tokens.create({ttl: 86400}).then(token => {
        console.log(token.iceServers)
        res.send({ ice: token.iceServers })
      }).catch(error => {
        console.log(error)
        res.status(503).send(error)
      })
    } catch (e) {
      console.log(e)
      res.status(500).send('Error when getting your credentials.')
    }
  })

  const httpServer = http.Server(app)

  const ioServer = io(httpServer, {
    origins: 'true'
  })
  ioServer.origins((origin, callback) => {
    callback(null, true)
  })
  FSS(app, log, host, port, ioServer, {}, httpServer)
}

module.exports = run
