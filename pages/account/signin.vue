<template>
  <v-container fill-height>
    <v-layout fill-height align-center>
      <v-flex xs12 sm8 md6 lg5 mx-auto>
        <v-card>
          <v-card-title>
            <h1>로그인</h1>
          </v-card-title>
          <v-card-text>
            <v-form v-model="validate.submit" ref="form">
              <v-text-field type="text" v-model="input.username" label="이메일" :rules="rules.email" />
              <v-text-field type="password" v-model="input.password" label="패스워드" :rules="rules.password" />
            </v-form>
            <div class='text-xs-center error--text' v-text='errMsg'></div>
          </v-card-text>
          <v-card-actions>
            <v-btn flat>아이디 / 패스워드 찾기</v-btn>
            <v-spacer />
            <v-btn to='/account/signup' flat>회원가입</v-btn>
            <v-btn color="primary" @click="submit" :disabled='!validate.submit || loading.submit'
              :loading='loading.submit'>로그인</v-btn>
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
          email: [
            v => (v && v.length > 0) || "이메일을 입력해주세요.",
            v => /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(v) ||
            "이메일 형식이 아닙니다."
          ],
          password: [
            v => (v && v.length > 0) || "패스워드를 입력해주세요.",
          ]
        },
        input: {
          username: "whaledoll@naver.com",
          password: "todtjd1!"
        },
        loading: {
          submit: false
        },
        validate: {
          submit: false
        },
        errMsg: null
      };
    },
    methods: {
      async submit() {
        // axios 호출
        this.loading.submit = true
        const res = await this.$store.dispatch("account/signin", this.input);
        if (res.success) {
          this.$router.push("/")
        } else {
          this.errMsg = res.message
        }
        this.loading.submit = false
      }
    }
  };

</script>
