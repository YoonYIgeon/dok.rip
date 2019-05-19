<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm8 md6 lg5 mx-auto>
        <v-card class='mb-1'>
          <v-card-text>
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-avatar size="60" color="#f9f9f9">
                  <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar">
                </v-list-tile-avatar>
                <v-list-tile-content class="pl-3">
                  <v-list-tile-title v-html="user.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="user.username"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn fab outline small color='primary'>
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
        <v-card class="pt-3 pb-2 mb-1">
          <v-card-text>
            <v-layout row justify-space-around>
              <div class='text-xs-center'>
                <div class="title mb-2">등록완료</div>
                <div>{{items.verified}}</div>
              </div>
              <div class='text-xs-center'>
                <div class="title mb-2">등록대기</div>
                <div>{{items.verifying}}</div>
              </div>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" flat @click='$router.push(`/book/enroll`)'>도서 등록하기</v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs4 v-for='(item, i) in items.list' :key='i'>
                <book :item='item'></book>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import book from "../../components/book.vue"
  const load = ({
    $axios
  }) => {
    return $axios.get('/api/account/mypage').then((res) => {
      if (res.status === 200) {
        return {
          items: res.data
        }
      }
    })
  }
  export default {
    components: {
      book
    },
    data() {
      return {
        rules: {
          email: [v => v && v.length > 0 || "이메일을 입력해주세요.", v =>
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(v) ||
            "이메일 형식이 아닙니다.", v => this.validate.isUnique || "중복 확인이 필요합니다."
          ],
          name: [v => v && v.length > 2 || "닉네임을 3글자 이상 입력해주세요."],
          password: [v => v && v.length > 0 || "패스워드를 입력해주세요.",
            v => v && v.length >= 8 || "8글자 이상 입력해주세요.",
            v => /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/.test(v) || "패스워드는 영문 + 숫자 조합으로 작성해주세요."
          ],
          password1: [v => v && v.length > 0 || "패스워드를 입력해주세요.",
            v => v && v.length >= 8 || "8글자 이상 입력해주세요.",
            v => /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/.test(v) || "패스워드는 영문 + 숫자 조합으로 작성해주세요.",
            v => v === this.input.password || "두 비밀번호가 다릅니다."
          ]
        },
        items: {}
      }
    },
    async asyncData(context) {
      return load(context)
    },
    computed: {
      user() {
        return this.$store.getters["account/user"];
      }
    }
  }

</script>
<style>
</style>
