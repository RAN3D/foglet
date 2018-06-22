<template>
  <div class="content">
    <b-modal size="lg" id="modal-montecarlo" title="Source code" hide-footer>
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
              <h3 class="card-title">Pi approximation using Monte Carlo method</h3>
            </template>
            <template slot="footer">
              <p data-toggle="tooltip" data-placement="top" title="Open the console to see the foglet" style='float:left; text-color:grey' @click='logfoglet()'>
                <b>Log; </b>
                <a href='#' v-b-modal.modal-montecarlo>
                  View source;
                </a>
              </p>
              <p style='float:right; text-color:grey'>
                Did you like this example? <a :href='config.gettingStarted'>  Try your own now</a>
              </p>
            </template>

              <div class="row"><div class="col-md-12"><p> Open a second window (required) </p></div></div>
              <div class="row">
                <div class="col-md-6">
                  <p> Local IN: <b>{{this.$store.state.montecarlo.localData[0]}}</b></p><br/>
                  <p> Local TOTAL: <b>{{this.$store.state.montecarlo.localData[1]}}</b></p><br/>
                  <p> Global IN: <b>{{this.$store.state.montecarlo.total[0]}}</b></p><br/>
                  <p> Global TOTAL: <b>{{this.$store.state.montecarlo.total[1]}}</b></p><br/>
                  <p> PI: <b>{{this.$store.state.montecarlo.pi}}</b></p>
                </div>
                <div class="col-md-6">
                  <canvas id="MonteCarloGraph" style="border:1px solid #000000;"></canvas>
                </div>
              </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Card from 'src/components/UIComponents/Cards/Card.vue'
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
        updateInterval: undefined,
        drawInterval: undefined,
        ctx: undefined,
        GRAPH_SIZE: 150
      }
    },
    mounted () {
      this.$store.state.montecarlo.communication.removeAllBroacastCallback()
      this.$store.state.montecarlo.communication.onBroadcast((id, msg) => {
        if (msg.type && msg.type === 'update') {
          console.log('receive: ', msg)
          this.$store.commit('montecarlo/set', [
            this.$store.state.montecarlo.register[0] + msg.value[0],
            this.$store.state.montecarlo.register[1] + msg.value[1]
          ])
        }
      })
      const c = document.getElementById('MonteCarloGraph')
      this.ctx = c.getContext('2d')
      this.showInterface()
    },
    beforeDestroy () {
      clearInterval(this.drawInterval)
      clearInterval(this.updateInterval)
    },
    methods: {
      logfoglet () {
        console.log(this)
      },
      showInterface () {
        this.ctx.canvas.width = this.GRAPH_SIZE
        this.ctx.canvas.height = this.GRAPH_SIZE
        this.ctx.beginPath()
        // circle with GRAPH_SIZE rayon
        this.ctx.arc(0, this.GRAPH_SIZE, this.GRAPH_SIZE, 0, 2 * Math.PI)
        this.ctx.stroke()
        this.drawInterval = setInterval(this.drawPoints, 10)
        this.updateInterval = setInterval(this.updateRegister, 2000)
      },
      formatMessage (type, value) {
        return {type, value}
      },
      drawPoints () {
        const x = Math.random() * 2 - 1
        const y = Math.random() * 2 - 1

        if (Math.pow(x, 2) + Math.pow(y, 2) < 1) {
          this.drawPoint(x, y, true)
          this.$store.commit('montecarlo/ld', 0)
        } else {
          this.drawPoint(x, y, false)
        }
        this.$store.commit('montecarlo/ld', 1)
      },
      drawPoint (x, y, isIn) {
        if (isIn) {
          this.ctx.fillStyle = '#5bc0de'
        } else {
          this.ctx.fillStyle = '#337ab7'
        }
        this.ctx.fillRect(x * this.GRAPH_SIZE, this.GRAPH_SIZE - this.GRAPH_SIZE * y, 2, 2)
      },
      updateRegister () {
        const dataToSet = [
          this.$store.state.montecarlo.register[0] + this.$store.state.montecarlo.localData[0],
          this.$store.state.montecarlo.register[1] + this.$store.state.montecarlo.localData[1]
        ]
        this.$store.commit('montecarlo/setTotal', dataToSet)
        // send current - previous
        const toSend = [
          this.$store.state.montecarlo.localData[0] - this.$store.state.montecarlo.previous[0],
          this.$store.state.montecarlo.localData[1] - this.$store.state.montecarlo.previous[1]
        ]
        console.log('Sending: ', toSend)
        this.$store.state.montecarlo.communication.sendBroadcast(this.formatMessage('update', toSend))
        this.$store.commit('montecarlo/setPrevious', [this.$store.state.montecarlo.localData[0], this.$store.state.montecarlo.localData[1]])
      }
    }
  }
</script>
<style>

</style>
