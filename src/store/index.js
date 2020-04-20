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
      // check if created by currentUser
      let createdByCurrentUser
      if (querySnapshot.docs.length) {
        createdByCurrentUser = store.state.user.currentUser.uid == querySnapshot.docChanges()[0].doc.data().userId ? true : false
      }

      // add new posts to hiddenPosts array after initial load
      if (querySnapshot.docChanges().length !== querySnapshot.docs.length
        && querySnapshot.docChanges()[0].type == 'added' && !createdByCurrentUser) {

        let post = querySnapshot.docChanges()[0].doc.data()
        post.id = querySnapshot.docChanges()[0].doc.id

        store.commit('post/setHiddenPosts', post)
      } else {
        let postsArray = []

        querySnapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
          postsArray.push(post)
        })

        store.commit('post/setPosts', postsArray)
      }
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
