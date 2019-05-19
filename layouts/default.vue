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
      <v-toolbar-items v-if="!user" class="hidden-sm-and-down">
        <v-btn flat small @click="$router.push('/account/signup')">회원가입</v-btn>
        <v-btn flat small @click="$router.push('/account/signin')">로그인</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else class="hidden-sm-and-down">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn flat v-on="on">{{user.name}} <v-icon>arrow_drop_down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <template v-for="(item, i) in afterLogin">
              <v-list-tile v-if="item.url" :to="item.url" :key="i">
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-else-if="item.func" :key="i" @click="item.func">
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </template>
          </v-list>
        </v-menu>
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
        afterLogin: [{
          title: "마이페이지",
          url: "/account/mypage"
        }, {
          title: "로그아웃",
          func: this.signout
        }],
        items: [{
          icon: "apps",
          title: "Welcome",
          to: "/"
        }, {
          icon: "bubble_chart",
          title: "Inspire",
          to: "/inspire"
        }],
        title: "Dok.rip"
      };
    },
    methods: {
      async signout() {
        this.$store.commit("account/signout", null);
      }
    },
    created() {
      this.$axios.defaults.headers.common.authorization = this.$store.state.account.token
    },
    computed: {
      user() {
        return this.$store.getters["account/user"];
      }
    }
  };

</script>
