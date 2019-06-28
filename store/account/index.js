import Cookie from 'cookie'
import Cookies from 'js-cookie'

export const state = () => ({
  user: null,
  token: null
})

export const mutations = {
  setUser(s, p) {
    s.user = p
  },
  setToken(s, p) {
    s.token = p
    this.$axios.defaults.headers.common.authorization = p
  },
  signout(s) {
    s.user = null
    this.$axios.defaults.headers.common.authorization = null
    Cookies.remove("dokripToken")
    this.$router.push("/")
  },
}

export const getters = {
  user(state) {
    return state.user
  }
}

export const actions = {
  async signin({
    commit
  }, input) {
    try {
      const res = await this.$axios.post("/api/account/login", input)
      // --> r.data = { token, user, message }
      if (res.status === 200) {
        const {
          token,
          user
        } = res.data
        Cookies.set("dokripToken", token, {
          expires: 7
        })
        this.$axios.defaults.headers.common.authorization = token
        commit("setUser", user)
        return {
          success: true
        }
      } else {
        throw res
      }
    } catch (err) {
      Cookies.remove("dokripToken")
      commit("setUser", null)
      return {
        success: false,
        message: err.response.data.message
      }
    }
  },
  async fetchToken(undefined, payload = "") {
    const cookie = Cookie.parse(payload) || {}
    return cookie.dokripToken
  }
}
