export const state = () => ({
  counter: 0
})

export const mutations = {
  increment(state) {
    state.counter++
  }
}

export const actions = {
  nuxtServerInit({
    commit
  }, {
    req
  }) {
    console.log("nuxtServerInit", req)
    // if (req.session && req.session.authUser) {
    //   commit('setUser', req.session.authUser)
    // }
  }
}
