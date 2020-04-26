const fb = require('../../firebaseConfig')

export const postModule = {
    namespaced: true,
    state: {
        posts: [],
    },
    mutations: {
        setPosts(state, val) {
            if (val) {
              state.posts = val
            } else {
              state.posts = []
            }
          },
    },
    actions: {
      fetchAllPosts({ commit }) {
        fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
          let postsArray = []
  
          querySnapshot.forEach(doc => {
            postsArray.push(doc.data())
          })
  
          commit('setPosts', postsArray)
      })
      }
    }
};