<template>
  <div class="Login">
    <h1 style="text-align: center; margin-top: 2em;">Login</h1>
    <form
      style="text-align: center; margin-top: 1em;"
      @submit.prevent="login()"
    >
      <div>
        <label for="username">Username</label><br />
        <input v-model="username" type="text" name="username" /><br />
      </div>
      <div style="margin-top: 10px;">
        <label for="password">Password</label><br />
        <input v-model="password" type="password" name="password" /><br />
      </div>
      <p style="color: red; margin-top: 10px;">
        {{ errorMessage }}
      </p>
      <input
        type="submit"
        value="Login"
        style="margin-top: 10px; padding: 3px;"
      />
    </form>
    <div style="text-align: center; margin-top: 15px;">
      <a href="/">Register?</a>
    </div>
  </div>
</template>

<script>
const validate = require('validate.js'); // validation package
const axios = require('axios');

const constraints = {
  // simple validation
  username: {
    presence: true,
    length: {
      minimum: 4,
      message: 'must be at least 4 characters!',
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: 'must be at least 6 characters!',
    },
  },
};

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    login() {
      const body = {
        username: this.username,
        password: this.password,
      };
      const validationError = validate(body, constraints);
      if (validationError) {
        this.errorMessage = 'Username / Password is invalid.';
      } else {
        this.errorMessage = '';
        const API_URL = process.env.VUE_APP_LOGIN;
        axios
          .post(API_URL, body)
          .then((tokenData) => {
            this.errorMessage = '';
            localStorage.token = tokenData.data.token;
            this.$router.push('/lobbies');
          })
          .catch((error) => {
            this.errorMessage = error.response.data;
          });
      }
    },
  },
};
</script>
