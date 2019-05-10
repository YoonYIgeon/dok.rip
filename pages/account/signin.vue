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
          </v-card-text>
          <v-card-actions>
            <v-btn flat>아이디 / 패스워드 찾기</v-btn>
            <v-spacer />
            <v-btn flat>회원가입</v-btn>
            <v-btn color="primary" @click="signin">로그인</v-btn>
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
            v => v.length >= 8 || "8글자 이상 입력해주세요.",
            v => /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/.test(v) || "패스워드는 영문 + 숫자 조합으로 작성해주세요."
          ]
        },
        input: {
          username: "whaledoll@naver.com",
          password: "todtjd1!"
        },
        validate: {
          submit: false
        }
      };
    },
    methods: {
      async signin() {
        // axios 호출
        const r = await this.$store.dispatch("account/signin", this.input);
        if (r) {
          this.$router.push("/")
        }
      }
    }
  };

</script>
