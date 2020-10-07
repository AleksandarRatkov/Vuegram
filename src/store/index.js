import Vue from 'vue'
import Vuex from 'vuex'
import { userModule } from './modules/userModule'
import { postModule } from './modules/postModule'
const fb = require('../firebaseConfig')

Vue.use(Vuex)

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('user/setCurrentUserId', user.uid)
    store.dispatch('user/fetchUserProfile')
    // store.dispatch('post/fetchAllPosts');
  }
})

export const store = new Vuex.Store({
  state: {
    drawer: true
  },
  mutations: {
    setDrawer(state, value) {
      state.drawer = value;
    }
  },
  actions: {
    clearData({ commit }) {
      commit('user/setCurrentUserId', null)
      commit('user/setUserProfile', {})
      commit('post/setPosts', [])
    },
  },
  modules: {
    user: userModule,
    post: postModule
  }
})
