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
                    <v-icon @click='edit.default = !edit.default'>edit</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card-text>
          <v-card-text v-if='edit.default'>
            <v-form class='mt-4' v-model="vali.default">
              <v-text-field v-model='input.name' label='username'></v-text-field>
              <v-text-field v-model='input.username' label='email'></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions v-if='edit.default'>
            <v-btn flat color='primary' @click='edit.password = !edit.password'>비밀번호 변경</v-btn>
            <v-spacer />
            <v-btn color='primary' @click=''>저장</v-btn>
          </v-card-actions>
          <v-card-text v-if='edit.password'>
            <v-form class='mt-4' v-model='vali.password'>
              <v-text-field v-model='input.original' :rules='rules.original' label='Your Password'></v-text-field>
              <v-text-field v-model='input.password' :rules='rules.password' label='New Password'></v-text-field>
              <v-text-field v-model='input.password2' :rules='rules.password2' label='Confirm Password'></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions v-if='edit.password'>
            <v-spacer />
            <v-btn color='primary' @click='submitPassword' :disabled='!vali.password || loading.password'
              :loading='loading.password'>비밀번호 변경하기</v-btn>
          </v-card-actions>
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
            <v-btn color="primary" outline @click='$router.push(`/book/enroll`)'>도서 등록하기</v-btn>
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
  // 꼭 필요한 데이터만 사전로딩
  // const load = ({
  //   $axios
  // }) => {
  //   return $axios.get('/api/account/mypage').then((res) => {
  //     if (res.status === 200) {
  //       return {
  //         items: res.data
  //       }
  //     }
  //   })
  // }
  export default {
    components: {
      book
    },
    data() {
      return {
        // 수정 관련 규칙
        rules: {
          email: [v => v && v.length > 0 || "이메일을 입력해주세요.", v =>
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(v) ||
            "이메일 형식이 아닙니다.", v => this.validate.isUnique || "중복 확인이 필요합니다."
          ],
          name: [v => v && v.length > 2 || "닉네임을 3글자 이상 입력해주세요."],
          original: [v => v && v.length > 0 || "기존 패스워드를 입력해주세요."],
          password: [v => v && v.length > 0 || "패스워드를 입력해주세요.",
            v => v && v.length >= 8 || "8글자 이상 입력해주세요.",
            v => /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/.test(v) || "패스워드는 영문 + 숫자 조합으로 작성해주세요."
          ],
          password2: [v => v && v.length > 0 || "패스워드를 입력해주세요.",
            v => v && v.length >= 8 || "8글자 이상 입력해주세요.",
            v => /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/.test(v) || "패스워드는 영문 + 숫자 조합으로 작성해주세요.",
            v => v === this.input.password || "두 비밀번호가 다릅니다."
          ]
        },
        // 도서 리스트
        items: {},
        input: {},
        // 수정 여부
        edit: {
          default: false,
          password: false
        },
        vali: {
          default: false,
          password: false
        },
        loading: {
          default: false,
          password: false
        }
      }
    },
    // async asyncData(context) {
    //   return load(context)
    // },
    methods: {
      loadBookData() {
        try {
          this.$axios.get('/api/account/mypage').then((res) => {
            if (res.status === 200) {
              this.items = res.data
            } else {
              throw new Error()
            }
          })
        } catch (err) {
          console.error(err)
        }
      },
      async submitPassword() {
        const {
          original,
          password,
          password2
        } = this.input
        const data = {
          original,
          password,
          password2
        }
        this.loading.password = true
        try {
          const res = await this.$axios.patch("/api/account/password", data)
          if (res.status === 200) {
            console.log(res.data)
          } else {
            throw new Error()
          }
        } catch (err) {
          console.log({
            ...err
          })
        } finally {
          this.loading.password = false
        }
      }
    },
    mounted() {
      this.loadBookData()
      this.input = {
        ...this.user
      }
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
