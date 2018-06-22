<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8">
          <sondage :view='sondage.view' :store='sondage.store'></sondage>
          <montecarlo :view='montecarlo.view' :store='montecarlo.store'></montecarlo>
          <video></video>
        </div>
        <div class="col-md-4">
          <chat :view='chat.view' :store='chat.store'></chat>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import Sondage from 'src/components/Examples/Sondage.vue'
  const SondageRaw = require('!!raw-loader!src/components/Examples/Sondage.vue')
  const SondageStoreRaw = require('!!raw-loader!src/components/Examples/store/sondage-store.js')
  import Chat from 'src/components/Examples/Chat.vue'
  const ChatRaw = require('!!raw-loader!src/components/Examples/Chat.vue')
  const ChatStoreRaw = require('!!raw-loader!src/components/Examples/store/chat-store.js')
  import Montecarlo from 'src/components/Examples/Montecarlo.vue'
  const MontecarloRaw = require('!!raw-loader!src/components/Examples/Montecarlo.vue')
  const MontecarloStoreRaw = require('!!raw-loader!src/components/Examples/store/montecarlo-store.js')
  import Video from 'src/components/Examples/Video.vue'
  export default {
    components: {
      Card,
      Sondage,
      Video,
      Montecarlo,
      Chat
    },
    data () {
      return {
        chat: {
          view: ChatRaw,
          store: ChatStoreRaw
        },
        sondage: {
          view: SondageRaw,
          store: SondageStoreRaw
        },
        montecarlo: {
          view: MontecarloRaw,
          store: MontecarloStoreRaw
        }
      }
    }
  }
</script>
<style>
tr {display: block; }
th, td { width: 300px; }
tbody { display: block; height: 300px; overflow: auto; scroll:auto; }
</style>
