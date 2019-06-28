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
              <v-text-field @input='emailChanged' type='text' v-model='input.username' label='이메일' :rules='rules.email'
                ref='email' :error-messages="errMsg" :error='!!errMsg'>
                <template v-slot:append-outer>
                  <v-btn :disabled='$refs.email && !$refs.email.valid' small :outline='!validate.isUnique'
                    :readonly='$refs.email && !$refs.email.valid' color='primary' class="ma-0" @click='unique'> 인증코드 전송
                  </v-btn>
                </template>
              </v-text-field>
              <v-text-field type='text' v-model='input.code' label='인증코드' ref='code' :rules='rules.code'>
                <template v-slot:append-outer v-if='$refs.code && $refs.code.valid'>
                  <v-icon>check</v-icon>
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
              <v-btn color='primary' @click='submit'
                :disabled='!(validate.submit && validate.isUnique) || loading.submit' :loading='loading.submit'>회원가입
              </v-btn>
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
          email: [v => v && v.length > 0 || "이메일을 입력해주세요.", v => /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/i
            .test(v) || "이메일 형식이 아닙니다."
          ],
          code: [v => v && v.length === 6 || "이메일로 전송된 6자리 숫자를 입력해주세요.",
            v => v === this.code || "잘못된 코드입니다."
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
        input: {
          username: "whaledoll@naver.com",
          name: "삶이란..?",
          password: "todtjd1!",
          password1: "todtjd1!"
        },
        validate: {
          isUnique: false,
          submit: false
        },
        loading: {
          submit: false
        },
        errMsg: null
      }
    },
    methods: {
      emailChanged() {
        this.validate.isUnique = false
        this.errMsg = null
      },
      async unique() {
        try {
          if (!this.validate.isUnique) {
            const res = await this.$axios.get("/api/account/unique", {
              params: {
                username: this.input.username
              }
            })
            if (res.status === 200) {
              this.validate.isUnique = res.data
              this.code = res.data.code
              console.log("code", this.code)
              this.errMsg = null
              this.$refs.email.validate()
            } else {
              throw res
            }
          }
        } catch (err) {
          this.errMsg = err.response.data.message
          console.log(err)
        } finally {
          console.log("ref", this.$refs.email)
        }
      },
      async submit() {
        try {
          this.loading.submit = true
          console.log(this.input)
          if (this.$refs.form) {
            const res = await this.$axios.post("/api/account/register", this.input)
            if (res.status === 200) {
              this.$router.push("/account/signin")
            } else {
              throw res
            }
          }
        } catch (err) {
          console.log(err)
        } finally {
          this.loading.submit = true
        }
      }
    },
  }

</script>
