import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import ErrorPage from './components/GeneralViews/ErrorPage.vue'
import BootstrapVue from 'bootstrap-vue'
// apply global conf
import config from './config.json'
// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'
// router setup
import routes from './routes/routes'
import 'es6-promise/auto'
import Vuex from 'vuex'
import { createStore, init } from './store'
import Highlight from 'vue-highlightjs'

// plugin setup
Vue.use(VueRouter)
Vue.use(Highlight)
Vue.use(LightBootstrap)
Vue.use(BootstrapVue)
Vue.use(Vuex)

init().then((fog) => {
  Vue.mixin({
    data () {
      return {
        get fog () {
          return fog
        },
        get config () {
          return config
        }
      }
    }
  })

  const store = createStore()
  console.log(store)
  Object.keys(store._modulesNamespaceMap).forEach(module => {
    console.log('Module: ', module)
    store._modulesNamespaceMap[module].context.commit(`init`)
  })

  // configure router
  const router = new VueRouter({
    routes, // short for routes: routes
    linkActiveClass: 'nav-item active'
  })

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store: store,
    render: h => h(App),
    router
  })
}).catch(e => {
  console.error(e)
  new Vue({
    el: '#app',
    components: {
      ErrorPage
    },
    template: '<error-page></error-page>'
  })
})
