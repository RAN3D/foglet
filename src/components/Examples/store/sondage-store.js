import { communication as Communication } from 'foglet-core'

export default function (fog) {
  return {
    namespaced: true,
    state: {
      register: [1, 1],
      communication: undefined
    },
    getters: {
      register: (state) => state.register,
      communication: (state) => state.communication
    },
    mutations: {
      set (state, message) {
        console.log('commit/sondage/set', message)
        state.register = message
      },
      init (state) {
        console.log('commit/sondage/init')
        state.communication = new Communication(fog.overlay().network, 'survey')
      }
    }
  }
}
