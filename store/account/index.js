import Cookie from 'cookie'
import Cookies from 'js-cookie'

export const state = () => ({
  user: null
})

export const mutations = {
  setUser(s, p) {
    s.user = p
  },
  signout(s) {
    s.user = null
    Cookies.remove("dokripToken")
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
      const r = await this.$axios.post("/api/account/login", input)
      // --> r.data = { token, user, message }
      if (r.status === 200) {
        const {
          token,
          user
        } = r.data
        Cookies.set("dokripToken", token, {
          expires: 7
        })
        commit("setUser", user)
        console.log("Cookies", Cookies.get("dokripToken"))
        return true
      } else {
        console.log(r)
        throw new Error()
      }
    } catch (err) {
      Cookies.remove("dokripToken")
      commit("setUser", null)
      console.error(err)
      return
    }
  },
  async fetchToken(undefined, payload = "") {
    const cookie = Cookie.parse(payload) || {}
    return cookie.dokripToken
  }
}
