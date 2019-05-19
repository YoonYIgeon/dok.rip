export const state = () => ({})

export const mutations = {}

export const actions = {
  async nuxtServerInit({
    commit,
    dispatch
  }, {
    req,
    app
  }) {
    // 첫번째 인자
    // commit, getters, state, rootGetters, rooteState
    // 두번째 인자
    // isStatic, isDev, isHMR, app, store, payload, err, base, env, req ...

    try {
      const token = await dispatch("account/fetchToken", req.headers.cookie)
      if (token) {
        app.$axios.defaults.headers.common.authorization = token
        const r = await this.$axios.get("/api/account/check")
        if (r.status === 200) {
          commit("account/setUser", r.data.info)
          commit("account/setToken", token)
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
