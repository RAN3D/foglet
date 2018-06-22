import { communication as Communication } from 'foglet-core'

export default function (fog) {
  return {
    namespaced: true,
    state: {
      communication: undefined
    },
    getters: {
      communication: (state) => state.communication
    },
    mutations: {
      init (state) {
        console.log('commit/video/init')
        state.communication = new Communication(fog.overlay().network, 'video')
      }
    }
  }
}
