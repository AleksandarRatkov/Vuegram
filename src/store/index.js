import Vue from 'vue'
import Vuex from 'vuex'
import { userModule } from './modules/userModule'
import { postModule } from './modules/postModule'
const fb = require('../firebaseConfig')

Vue.use(Vuex)

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('user/setCurrentUser', user)
    store.dispatch('user/fetchUserProfile')

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('user/setUserProfile', doc.data())
    })

    // realtime updates from our posts collection
    fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
        let postsArray = []

        querySnapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
          postsArray.push(post)
        })

        store.commit('post/setPosts', postsArray)
    })
  }
})

export const store = new Vuex.Store({
  state: {
    drawer: true
  },
  mutations: {
    setDrawer(state,value) {
      state.drawer = value;
    }
  },
  actions: {
    clearData({ commit }) {
      commit('user/setCurrentUser', null)
      commit('user/setUserProfile', {})
      commit('post/setPosts', [])
    }
  },
  modules: {
    user: userModule,
    post: postModule
  }
})
