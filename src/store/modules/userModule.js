const fb = require('../../firebaseConfig')

export const userModule = {
  namespaced: true,
  state: {
    currentUserId: null,
    userProfile: {},
    users: []
  },
  mutations: {
    setCurrentUserId(state, val) {
      state.currentUserId = val
    },
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setUsers(state, val) {
      state.users = val
    }
  },
  actions: {
    fetchUsersBeside({ commit, state }) {
      fb.usersCollection.get().then(querySnapshot => {
        let fetchedUsers = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }
        })
        _.remove(fetchedUsers, function (user) {
          return user.id === state.currentUserId;
        });
        commit('setUsers', fetchedUsers)
      }).catch(err => {
        console.log(err)
      })
    },
    fetchUserProfile({ commit, state }) {
      fb.usersCollection.doc(state.currentUserId).get().then(res => {
        let user = res.data();
        user.id = res.id;
        commit('setUserProfile', user)
      }).catch(err => {
        console.log(err)
      })
    },
    updateProfile({ state }, data) {
      let name = data.name
      let title = data.title
      let profileImageUrl = data.profileImageUrl

      fb.usersCollection.doc(state.currentUserId).update({ name, title, profileImageUrl }).then(() => {
        // update all posts by user to reflect new name
        fb.postsCollection.where('userId', '==', state.currentUserId).get().then(docs => {
          docs.forEach(doc => {
            fb.postsCollection.doc(doc.id).update({
              userName: name,
              profileImageUrl: profileImageUrl
            })
          })
        })
        // update all comments by user to reflect new name
        fb.commentsCollection.where('userId', '==', state.currentUserId).get().then(docs => {
          docs.forEach(doc => {
            fb.commentsCollection.doc(doc.id).update({
              userName: name,
              profileImageUrl: profileImageUrl
            })
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    updateProfileFollowing({ state }, data) {
      let following = data.following

      fb.usersCollection.doc(state.currentUserId).update({ following });
    }
  }
};