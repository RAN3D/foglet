<template>
  <div class="content">
    <b-modal size="lg" id="modal-chat" title="Source code" hide-footer>
      <p>Source code of the Vue.js View</p>
      <pre v-highlightjs="view"><code class="html"></code></pre> <hr/>
      <p>Source code of the Vue.js Store (Vuex)</p>
      <pre v-highlightjs="store"><code class="javascript"></code></pre>
    </b-modal>
    <!-- Modal Component -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <card>
            <template slot="header">
              <h3 class="card-title">Foglet Chat</h3>
            </template>
            <template slot="footer">
              <p data-toggle="tooltip" data-placement="top" title="Open the console to see the foglet" style='float:left; text-color:grey' @click='logfoglet()'>
                <b>Log; </b>
                <a href='#' v-b-modal.modal-chat>
                  View source;
                </a>
              </p>
              <p style='float:right; text-color:grey'>
                Did you like this example? <a :href='config.gettingStarted'>  Try your own now</a>
              </p>
            </template>
            <div class="row">
              <div class="col-md-12"><p> Red messages are retreived with an Anti-Entropy mechanism (5s) </p></div>
              <b-table id='table-chat' hover small :items="items" :fields="fields"><span slot="message" slot-scope="data" v-html="data.value"></span></b-table>
              <b-container>
                <b-input-group  @keyup.enter="submit" >
                  <b-form-input type="text" v-model="message" placeholder="Write a message and ENTER"></b-form-input>
                  <button  class='nc-icon nc-send' width=10 @click="submit"></button>
                </b-input-group>
              </b-container>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import 'es6-promise/auto'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import 'highlight.js/styles/github.css'

  // import { mapState } from 'vuex'
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
        lastId: undefined,
        fields: [ 'id', 'message' ],
        message: '',
        items: this.$store.state.chat.items
      }
    },
    mounted () {
      console.log(this)
      this.$store.state.chat.communication.removeAllBroacastCallback()
      this.$store.state.chat.communication.onBroadcast((id, message) => {
        console.log('Chat receive: ', id, message)
        this.show(id, message)
      })
    },
    methods: {
      logfoglet () {
        console.log(this)
        console.log(this.source)
      },
      show (id, msg) {
        console.log('Chat-Receive: ', id, msg)
        const vector = this.$store.state.chat.communication.broadcast._causality.vector
        const tmpEc = {
          e: msg.id,
          c: vector.arr[vector.indexOf(msg.id)].v
        }
        const ec = msg.causality || tmpEc
        const toPush = Object.assign({
          causality: ec,
          id: msg.id,
          message: msg.message
        }, {})
        if (msg.entropy) toPush.message = `<span style="color:red">${toPush.message}</span>`
        this.$store.commit('chat/add', toPush)
        // this.items.push(toPush)
        $('#table-chat').scrollTop(Math.max($('#table-chat').height(), 0))
      },
      submit (event) {
        const id = this.$store.state.chat.communication.sendBroadcast({message: this.message, id: this.fog.id}, undefined, this.lastId)
        this.lastId = id
        const message = {
          causality: id,
          id: this.fog.id,
          message: this.message
        }
        this.show(null, message)
        this.message = ''
      }
    }
  }
</script>
