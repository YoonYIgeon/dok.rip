<template>
  <v-container fill-height>
    <v-layout fill-height align-center>
      <v-flex xs12 sm8 md6 lg5 mx-auto>
        <v-card>
          <v-card-title>
            <h1>회원가입</h1>
          </v-card-title>
          <v-card-text>
            <v-form v-model="validate.submit" ref="form">
              <v-text-field type='text' v-model='input.username' label='이메일' :rules='rules.email' ref='email'
                @change='validate.isUnique = false'>
                <template v-slot:append-outer>
                  <v-btn :disabled='!(input.username&&input.username.length)' small :outline='!validate.isUnique'
                    :readonly='$refs.email && $refs.email.valid' color='primary' class="ma-0" @click='unique'> 중복확인
                  </v-btn>
                </template>
              </v-text-field>
              <v-text-field type='text' v-model='input.name' label='닉네임' :rules='rules.name' />
              <v-text-field type='password' v-model='input.password' label='패스워드' :rules='rules.password' />
              <v-text-field type='password' v-model='input.password1' label='패스워드 확인' :rules='rules.password1' />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-layout row wrap align-content-end>
              <v-btn flat small v-text='"이용약관"' />
              <v-spacer></v-spacer>
              <v-btn flat v-text='"돌아가기"' />
              <v-btn color='primary' v-text='"회원가입"' @click='submit'
                :disabled='!(validate.submit && validate.isUnique)' />
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    data() {
      return {
        rules: {
          email: [v => v && v.length > 0 || "이메일을 입력해주세요.", v =>
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(v) ||
            "이메일 형식이 아닙니다."
          ],
          name: [v => v && v.length > 2 || "닉네임을 3글자 이상 입력해주세요."],
          password: [v => v && v.length > 0 || "패스워드를 입력해주세요.",
            v => v.length >= 8 || "8글자 이상 입력해주세요.",
            v => /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/.test(v) || "패스워드는 영문 + 숫자 조합으로 작성해주세요."
          ],
          password1: [v => v && v.length > 0 || "패스워드를 입력해주세요.",
            v => v.length >= 8 || "8글자 이상 입력해주세요.",
            v => /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/.test(v) || "패스워드는 영문 + 숫자 조합으로 작성해주세요.",
            v => v === this.input.password || "두 비밀번호가 다릅니다."
          ]
        },
        input: {
          username: "whaledoll@naver.com",
          name: "삶이란..?",
          password: "todtjd1!",
          password1: "todtjd1!"
        },
        validate: {
          isUnique: false,
          submit: false
        }
      }
    },
    methods: {
      async unique() {
        try {
          if (this.$refs.email.valid && !this.validate.isUnique) {
            const r = await this.$axios.get("/api/account/unique", {
              params: {
                username: this.input.username
              }
            })
            if (r.status === 200) {
              this.validate.isUnique = r.data
              console.log(r.data)
            } else {
              throw Error(r.data)
            }
          }
        } catch (err) {
          console.log(err)
        }
      },
      async submit() {
        try {
          console.log(this.input)
          if (this.$refs.form) {
            const r = await this.$axios.post("/api/account/register", this.input)
            if (r.status === 200) {
              this.$router.push("/account/signin")
            } else {
              throw Error(r.data)
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
  }

</script>
