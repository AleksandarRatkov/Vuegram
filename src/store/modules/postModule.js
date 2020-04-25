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
    }
};