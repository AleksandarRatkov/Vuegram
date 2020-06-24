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
          postsArray.push({ id: doc.id, ...doc.data() })
        })
        let userProfile = this.state.user.userProfile;
        let ids = userProfile.following;
        ids.push(userProfile.id);

        postsArray = _.filter(postsArray, post => {
          return _.includes(ids, post.userId)
        })
        commit('setPosts', postsArray)
      })
    }
  }
};