var Foglet = foglet.Foglet, spray, montecarlo, intervalFirstValue, initialized

montecarlo = new function () {
  this.setValue = (value) => {
    this.value = value
    foglet.sendBroadcast(formatMessage('update', value))
  }
  this.getValue = () => { return this.value }
  this.value = [0, 1]
}()

$.ajax({
  url: 'https://signaling.herokuapp.com/ice',
  success: function (response, status) {
    console.log(status)
    console.log(response)


    foglet = new foglet.Foglet({
      verbose: true, // want some logs ? switch to false otherwise
      rps: {
        type: 'spray-wrtc',
        options: {
          protocol: 'montecarlo', // foglet running on the protocol foglet-example, defined for spray-wrtc
          webrtc:	{ // add WebRTC options
            trickle: true, // enable trickle (divide offers in multiple small offers sent by pieces)
            config: {iceServers: response.ice} // define iceServers in non local instance
          },
          timeout: 2 * 60 * 1000, // spray-wrtc timeout before definitively close a WebRTC connection.
          delta: 60 * 1000, // spray-wrtc shuffle interval
          signaling: {
            address: 'https://signaling.herokuapp.com/',
            // signalingAdress: 'https://signaling.herokuapp.com/', // address of the signaling server
            room: 'montecarlo' // room to join
          }
        }
      }
    })
    // engage the share signaling process
    foglet.share()
		/**
		 * Connect the client to another peer of the network.
		 * @return {[type]} [description]
		 */
		 foglet.connection().then(() => {
       // once connected engage the process to retrieve old data
   intervalFirstValue = setInterval(() => {
         // send a request to only one peer
     let randomPeer = foglet.getRandomNeighbourId()
     console.log(randomPeer)
     if (randomPeer) foglet.sendUnicast(randomPeer, formatMessage('request-montecarlo', {}))
   }, 2000)
		 })

    foglet.onUnicast((id, msg) => {
      console.log('Receive unicast message: ', id, msg)
      if (msg.type && msg.type === 'request-montecarlo') {
         // respond with the register
        console.log('Respond with our register value. ', id, msg)
        foglet.sendUnicast(id, formatMessage('answer-montecarlo', montecarlo.getValue()))
      } else if (msg.type && msg.type === 'answer-montecarlo') {
        if (intervalFirstValue) clearInterval(intervalFirstValue)
         // update the local register
        console.log(msg.value)
        montecarlo.value = msg.value
        showInterface()
        initialized = true
      }
    })

    foglet.onBroadcast((id, msg) => {
      if (initialized && msg.type && msg.type === 'update') {
        console.log('Receive an updated value: ', msg.value)
        montecarlo.value = msg.value
        changeData(msg.value)
      }
    })
  }
})

function showInterface () {
  /**
   * init local canvas (Monte carlo graph)
   */
  initCanvas()
  setInterval(drawPoints, 10)
  setInterval(updateRegister, 2000)
}

function formatMessage (type, value) {
  return {type, value}
}

var localData = [0, 0]
var previousUpdate = [0, 0]

function drawPoints () {
  var x = Math.random() * 2 - 1
  var y = Math.random() * 2 - 1

  if (Math.pow(x, 2) + Math.pow(y, 2) < 1) {
    drawPoint(x, y, true)
    localData[0]++
  } else {
    drawPoint(x, y, false)
  }
  localData[1]++
  changeLocalData(localData)
}

/**
 * Update the register
 */
function updateRegister () {
  var data = montecarlo.getValue()
  var dataToSet = [data[0] + localData[0] - previousUpdate[0], data[1] + localData[1] - previousUpdate[1]]
  montecarlo.setValue(dataToSet)
  previousUpdate = [localData[0], localData[1]]
}
