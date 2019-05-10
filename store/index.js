export const state = () => ({
  user: null
})

export const mutations = {
  setUser(s, p) {
    s.user = p
  }
}

export const actions = {
  async nuxtServerInit({
    commit,
    dispatch
  }, {
    req
  }) {
    // 첫번째 인자
    // commit, getters, state, rootGetters, rooteState
    // 두번째 인자
    // isStatic, isDev, isHMR, app, store, payload, err, base, env, req ...

    const token = await dispatch("account/fetchToken", req.headers.cookie)
    try {
      console.log(token)
      if (token) {
        this.$axios.defaults.headers.common["authorization"] = token
        const r = await this.$axios.get("/api/account/check")
        if (r.status === 200) {
          commit("account/setUser", r.data.info)
        } else {
          throw new Error()
        }
      }
    } catch (err) {
      console.error(err)
      return
    }
  },
}
