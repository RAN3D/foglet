localStorage.debug = 'foglet-core:*'

const Foglet = foglet.Foglet

var foglet, spray, register, votesData, svg, initialized
let f
$(document).ready(function () {
  $('#survey').hide()
  $('#connection').show()
})

/**
* Create a register named sondage
* @param {[type]} "sondage" [description]
*/
register = {
  sondage: [0, 0]
}

let intervalFirstValue

/*
* Votes data structure for d3
*/
votesData = [
  {label: 'Oui', color: '#2AABD2'},
  {label: 'Non', color: '#265A88'}
]

/**
Http request in order to get list of stun servers
**/
var iceServers = []
$.ajax({
  url: 'https://signaling.herokuapp.com/ice',
  success: function (response, status) {
    console.log(status)
    console.log(response)

    f = new Foglet({
      verbose: true, // want some logs ? switch to false otherwise
      rps: {
        type: 'spray-wrtc',
        options: {
          protocol: 'survey-second', // foglet running on the protocol foglet-example, defined for spray-wrtc
          webrtc:	{ // add WebRTC options
            trickle: true, // enable trickle (divide offers in multiple small offers sent by pieces)
            config: {iceServers: response.ice} // define iceServers in non local instance
          },
          timeout: 2 * 60 * 1000, // spray-wrtc timeout before definitively close a WebRTC connection.
          delta: 60 * 1000, // spray-wrtc shuffle interval
          signaling: {
            address: 'https://signaling.herokuapp.com/',
            // signalingAdress: 'https://signaling.herokuapp.com/', // address of the signaling server
            room: 'survey-second' // room to join
          }
        }
      }
    })

    // engage the share signaling process
    f.share()

    // connection to the network throught the signaling server
    f.connection().then(() => {
      console.log('Your are now connected.')

      // once connected engage the process to retrieve old data
      intervalFirstValue = setInterval(() => {
        // send a request to only one peer
        let randomPeer = f.getRandomNeighbourId()
        console.log(randomPeer)
        if (randomPeer) f.sendUnicast(randomPeer, formatMessage('request-votes', {}))
      }, 2000)
    })

    f.onUnicast((id, msg) => {
      console.log('Receive unicast message: ', id, msg)
      if (msg.type && msg.type === 'request-votes') {
        // respond with the register
        console.log('Respond with our register value. ', id, msg)
        f.sendUnicast(id, formatMessage('answer-votes', register))
      } else if (msg.type && msg.type === 'answer-votes') {
        if (intervalFirstValue) clearInterval(intervalFirstValue)
        // update the local register
        console.log(msg.value.sondage)
        setVotes(msg.value.sondage)
        showInterface()
        initialized = true
      }
    })

    f.onBroadcast((id, msg) => {
      if (initialized && msg.type && msg.type === 'update') {
        console.log('Receive an updated value: ', msg.value.sondage)
        setVotes(msg.value.sondage)
      }
    })
  }
})

function showInterface () {
  /*
  * Create the canvas in chart id html tag
  * and draw the pieGraph
  */
  svg = d3.select('#chart').append('svg').attr('width', 300).attr('height', 300)
  svg.append('g').attr('id', 'quotesDonut')
  Donut3D.draw('quotesDonut', updateData(register.sondage), 150, 150, 130, 100, 30, 0)

  $('#survey').show()
  $('#connection').hide()
}

function formatMessage (type, value) {
  return {type, value}
}

/**
 * Set the register and update graph
 */
function setVotes (value) {
  register.sondage = value
  changeData(register.sondage)
}

/**
 * add a yes vote to register
 * and update graph
 */
function addYes () {
  value = register.sondage
  setVotes([++value[0], value[1]])
  broadcast(register)
}

/**
 * add a No vote to register
 * and update graph
 */
function addNo () {
  value = register.sondage
  setVotes([value[0], ++value[1]])
  broadcast(register)
}

function broadcast (reg) {
  // broadcast the register to all peers that we changed the register
  f.sendBroadcast(formatMessage('update', reg))
}

/*
* Update the canvas with new values
*/
function changeData (value) {
  console.log('Change Data: ', value)
  $('#yesLabel').html('Oui:' + value[0])
  $('#noLabel').html('Non:' + value[1])
  Donut3D.transition('quotesDonut', updateData(value), 130, 100, 30, 0)
}
function updateData (votes) {
  return votesData.map(function (d, i) {
    return {label: d.label, value: votes[i], color: d.color}
  })
}
