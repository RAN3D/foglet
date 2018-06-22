import VVwE from 'version-vector-with-exceptions'
import { communication as Communication } from 'foglet-core'

export default function (fog) {
  return {
    namespaced: true,
    state: {
      items: [],
      communication: undefined
    },
    getters: {
      items: (state) => state.items,
      communication: (state) => state.communication
    },
    mutations: {
      add (state, message) {
        console.log('commit/chat/add', message)
        state.items.push(message)
      },
      init (state) {
        console.log('commit/chat/init')
        state.communication = new Communication(fog.overlay().network, 'chat')
        state.communication.broadcast.startAntiEntropy(5 * 1000)
        state.communication.broadcast._defaultBehaviorAntiEntropy = (id, messageCausality, ourCausality) => {
          var remoteVVwE = (new VVwE(null)).constructor.fromJSON(messageCausality) // cast
          var toSearch = []

          // #1 for each entry of our VVwE, look if the remote VVwE knows less
          for (var i = 0; i < ourCausality.vector.arr.length; ++i) {
            const localEntry = ourCausality.vector.arr[i]
            const index = remoteVVwE.vector.indexOf(ourCausality.vector.arr[i])
            let start = 1
            // #A check if the entry exists in the remote vvwe
            if (index >= 0) {
              start = remoteVVwE.vector.arr[index].v + 1
            };
            for (let j = start; j <= localEntry.v; ++j) {
              // #B check if not one of the local exceptions
              if (localEntry.x.indexOf(j) < 0) {
                toSearch.push({
                  _e: localEntry.e,
                  _c: j
                })
              }
            }
            // #C handle the exceptions of the remote vector
            if (index >= 0) {
              for (let j = 0; j < remoteVVwE.vector.arr[index].x.length; ++j) {
                const except = remoteVVwE.vector.arr[index].x[j]
                if (localEntry.x.indexOf(except) < 0 && except <= localEntry.v) {
                  toSearch.push({
                    _e: localEntry.e,
                    _c: except
                  })
                }
              }
            }
          }
          var elements = []
          toSearch.forEach(elem => {
            const index = state.items.findIndex(e => {
              return (elem._e === e.causality.e) && (elem._c === e.causality.c)
            })
            if (index >= 0) {
              const m = {
                id: state.items[index].causality,
                payload: state.items[index]
              }
              m.payload.entropy = true
              elements.push(m)
            }
          })
          // #2 send back the found elements
          if (elements.length !== 0) {
            console.log('Send entropy elements: ', elements)
            state.communication.broadcast.sendAntiEntropyResponse(id, ourCausality, elements)
          }
        }
      }
    }
  }
}
