<template>
  <div class="Login">
    <h1 style="text-align: center; margin-top: 2em;">Login</h1>
    <form
      @submit.prevent="login()"
      style="text-align: center; margin-top: 1em;"
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
      <a href="/">Register?</a><br />
      <div style="margin-top: 5px;">
        <a href="/admin-login">Admin?</a>
      </div>
    </div>
  </div>
</template>

<script>
import validate from 'validate.js'; // validate user input on login
import axios from 'axios'; // AJAX

const constraints = {
  // user input constraints
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
    async login() {
      const body = {
        // input from user
        username: this.username,
        password: this.password,
      };
      const validationError = validate(body, constraints); // validate the body against constraints
      if (validationError) {
        this.errorMessage = 'Username / Password is invalid.'; // if error return according error message
      } else {
        // everything went fine
        this.errorMessage = ''; // clear of all errors
        const API_URL = process.env.VUE_APP_LOGIN;
        try {
          // fetch token
          const tokenData = await axios.post(API_URL, body);
          localStorage.token = tokenData.data.token;
          this.$router.push('/lobbies');
        } catch (error) {
          // failed to fetch token
          this.errorMessage = error.response.data;
        }
      }
    },
  },
};
</script>
