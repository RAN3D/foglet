<template>
  <div class="content">
    <b-modal size="lg" id="modal-sondage" title="Source code" hide-footer>
      <p>Source code of the Vue.js View</p>
      <pre v-highlightjs="view"><code class="html"></code></pre> <hr/>
      <p>Source code of the Vue.js Store (Vuex)</p>
      <pre v-highlightjs="store"><code class="javascript"></code></pre>
    </b-modal>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <card>
            <template slot="header">
              <h3 class="card-title">Example of a simple survey</h3>
            </template>
            <template slot="footer">
              <p data-toggle="tooltip" data-placement="top" title="Open the console to see the foglet" style='float:left; text-color:grey' @click='logfoglet()'>
                <b>Log; </b>
                <a href='#' v-b-modal.modal-sondage>
                  View source;
                </a>
              </p>
              <p style='float:right; text-color:grey'>
                Did you like this example? <a :href='config.gettingStarted'>  Try your own now</a>
              </p>
            </template>

            <h4>
              Do you think that the elephant is stronger than hippopotamus?
              <div id='survey'>
                <button @click="addYes()" class="btn btn-info btn-lg">YES</button>
                <button @click="addNo()" class="btn btn-primary btn-lg">NO</button>
              </div>
            </h4>
            <div class="row">
              <div class="col-md-12">
                <canvas id="chart"></canvas>
                <div id='connection'>
                  <p>The Foglet is not connected for the moment</p>
                </div>
              </div>
            </div>

          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Card from '../UIComponents/Cards/Card.vue'
  import Chart from 'Chart.js'

  export default {
    components: {
      Card
    },
    props: {
      view: { Required: true },
      store: { Required: true }
    },
    data () {
      return {
        message: '**Loading** content...',
        register: this.$store.state.sondage.register,
        intervalFirstValue1: undefined,
        votesData: [
          {label: 'Oui', color: '#2AABD2'},
          {label: 'Non', color: '#265A88'}
        ],
        initialized: false
      }
    },
    mounted () {
      this.$store.state.sondage.communication.removeAllUnicastCallback()
      this.$store.state.sondage.communication.onUnicast((id, msg) => {
        console.log('Receive unicast message: ', id, msg)
        if (msg.type && msg.type === 'request-votes') {
          // respond with the register
          console.log('Respond with our register value. ', id, msg)
          this.$store.state.sondage.communication.sendUnicast(id, this.formatMessage('answer-votes', this.$store.state.sondage.register))
        } else if (msg.type && msg.type === 'answer-votes') {
          if (this['intervalFirstValue']) {
            console.log('clear interval')
            clearInterval(this['intervalFirstValue'])
          }
          // update the local register
          console.log(msg.value)
          this.showInterface()
          this.setVotes(msg.value)
          this.initialized = true
        }
      })
      this.$store.state.sondage.communication.removeAllBroacastCallback()
      this.$store.state.sondage.communication.onBroadcast((id, msg) => {
        if (this.initialized && msg.type && msg.type === 'update') {
          console.log('Receive an updated value: ', msg.value)
          this.setVotes(msg.value)
        }
      })
      // once connected engage the process to retrieve old data
      this.showInterface()
      this.intervalFirstValue = setInterval(() => {
        // send a request to only one peer
        let randomPeer = this.fog.getRandomNeighbourId()
        if (randomPeer) this.$store.state.sondage.communication.sendUnicast(randomPeer, this.formatMessage('request-votes', {}))
      }, 2000)
    },
    methods: {
      showInterface () {
        this['svg'] = new Chart($('#chart'), {
          type: 'doughnut',
          data: this.changeData(this.$store.state.sondage.register)
        })
        $('#survey').show()
        $('#connection').hide()
      },
      formatMessage (type, value) {
        return {type, value}
      },
      setVotes (value) {
        this.$store.commit('sondage/set', value)
        this['svg'] = new Chart($('#chart'), {
          type: 'doughnut',
          data: this.changeData(value)
        })
      },
      addYes () {
        let value = this.$store.state.sondage.register
        this.setVotes([++value[0], value[1]], 1)
        this.broadcast(this.register, 1)
      },
      addNo () {
        let value = this.$store.state.sondage.register
        this.setVotes([value[0], ++value[1]], 1)
        this.broadcast(this.$store.state.sondage.register, 1)
      },
      broadcast (reg) {
        // broadcast the register to all peers that we changed the register
        this.$store.state.sondage.communication.sendBroadcast(this.formatMessage('update', reg))
      },
      changeData (value) {
        console.log('Change Data: ', value)
        return {
          datasets: [{
            data: value,
            backgroundColor: [
              '#2AABD2',
              '#265A88'
            ]
          }],
          labels: [
            'Yes',
            'No'
          ]
        }
      },
      logfoglet () {
        console.log(this)
      }
    }
  }
</script>
<style>
path.slice{
	stroke-width:2px;
}
polyline{
	opacity: .3;
	stroke: black;
	stroke-width: 2px;
	fill: none;
}
svg text.percent{
	fill:white;
	text-anchor:middle;
	font-size:12px;
}
</style>
