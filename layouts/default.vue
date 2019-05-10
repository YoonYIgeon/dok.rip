<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list>
        <v-list-tile v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-toolbar-items v-if='!user' class="hidden-sm-and-down">
        <v-btn flat small @click='$router.push("/account/signup")'>회원가입</v-btn>
        <v-btn flat small @click='$router.push("/account/signin")'>로그인</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else class="hidden-sm-and-down">
        <v-btn flat small @click='signOut'>로그아웃</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>
<script>
  export default {
    data() {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        items: [{
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        }, {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire'
        }],
        title: 'Dok.rip'
      }
    },
    methods: {
      async signOut() {
        this.$store.commit("account/setUser", null)
        localStorage.removeItem("token")
        this.$axios.defaults.headers.common["access_token"] = undefined;
      }
    },
    computed: {
      user() {
        return this.$store.getters["account/user"]
      }
    }
  }

</script>
