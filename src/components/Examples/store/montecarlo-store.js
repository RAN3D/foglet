import { communication as Communication } from 'foglet-core'

export default function (fog) {
  return {
    namespaced: true,
    state: {
      register: [0, 1],
      localData: [0, 0],
      total: [0, 0],
      previous: [0, 0],
      pi: 0,
      communication: undefined
    },
    getters: {
      register: (state) => state.register,
      localData: (state) => state.localData,
      total: (state) => state.total,
      previous: (state) => state.previous,
      communication: (state) => state.communication
    },
    mutations: {
      ld (state, col) {
        state.localData[col]++
      },
      set (state, message) {
        console.log('commit/montecarlo/set', message)
        state.register = message
      },
      setLocalData (state, message) {
        console.log('commit/montecarlo/setLocalData', message)
        state.localData = message
      },
      setTotal (state, message) {
        state.total = message
        state.pi = 4 * (state.total[0] / state.total[1])
      },
      setPrevious (state, message) {
        state.previous = message
      },
      init (state) {
        console.log('commit/montecarlo/init')
        state.communication = new Communication(fog.overlay().network, 'montecarlo')
      }
    }
  }
}
