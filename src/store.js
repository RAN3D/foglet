import 'es6-promise/auto'
import Vuex from 'vuex'
import config from './config.json'
import { Foglet } from 'foglet-core'
import Uniqid from 'uniqid'
import ChatStore from './components/Examples/store/chat-store'
import SondageStore from './components/Examples/store/sondage-store'
import MontecarloStore from './components/Examples/store/montecarlo-store'

let fog
export function createStore () {
  return new Vuex.Store({
    modules: {
      chat: ChatStore(fog),
      sondage: SondageStore(fog),
      montecarlo: MontecarloStore(fog)
    }
  })
}

export function init () {
  return new Promise((resolve, reject) => {
    getIces().then((ices) => {
      fog = new Foglet({
        verbose: true, // want some logs ? switch to false otherwise
        id: Uniqid(),
        rps: {
          type: 'spray-wrtc',
          options: {
            protocol: 'foglet-core-website', // foglet running on the protocol foglet-example, defined for spray-wrtc
            webrtc: { // add WebRTC options
              trickle: true, // enable trickle (divide offers in multiple small offers sent by pieces)
              config: {iceServers: ices} // define iceServers in non local instance
            },
            timeout: 2 * 60 * 1000, // spray-wrtc timeout before definitively close a WebRTC connection.
            delta: 60 * 1000, // spray-wrtc shuffle interval
            signaling: {
              address: config.signaling,
              // signalingAdress: 'https://signaling.herokuapp.com/', // address of the signaling server
              room: 'foglet-core-website' // room to join
            }
          }
        }
      })
      // engage the share signaling process
      fog.share()

      // connection to the network throught the signaling server
      fog.connection().then(() => {
        console.log('foglet connected.')
        // enable the send button
        resolve(fog)
      }).catch(e => {
        console.error(e)
        reject(e)
      })
    }).catch(e => {
      console.error(e)
      reject(e)
    })
  })
}

function getIces () {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: config.signaling + '/ice',
      success: function (response, status) {
        console.log(status)
        console.log(response)
        response.ice.forEach(ice => {
          console.log(ice)
          ice.urls = String(ice.url)
          delete ice.url
        })
        resolve(response.ice)
      },
      error: function (xHr, status, error) {
        console.error(error)
        reject(error)
      }
    })
  })
}
