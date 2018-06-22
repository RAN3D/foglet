<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <card>
            <vue-markdown ref=markdown v-bind:source='message'></vue-markdown>
          </card>
        </div>
        <!-- <div class="col-md-4">
          <card>

          </card>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
  import Card from '../../UIComponents/Cards/Card.vue'
  import VueMarkdown from 'vue-markdown'
  export default {
    components: {
      Card,
      VueMarkdown
    },
    data () {
      return { message: '**Loading** content...' }
    },
    mounted () {
      $.get('https://raw.githubusercontent.com/RAN3D/foglet-core/master/README.md').then((response) => {
        this.$refs.markdown.source = response
      }).catch(e => {
        console.error(e)
      })
    }
  }
</script>
<style>

</style>
