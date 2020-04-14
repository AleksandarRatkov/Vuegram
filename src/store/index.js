import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: true
  },
  getters: {
    getDrawer : state => state.drawer
  },
  mutations: {
    setDrawer(state,value) {
      state.drawer = value;
    }
  },
  actions: {
  },
  modules: {
  }
})
