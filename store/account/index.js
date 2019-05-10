export const state = () => ({
  user: null
})

export const mutations = {
  setUser(s, p) {
    s.user = p
  },
}

export const getters = {
  user(state) {
    return state.user
  }
}
