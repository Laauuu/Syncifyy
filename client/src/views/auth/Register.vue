<template>
  <div class="Register">
    <h1 style="text-align: center; margin-top: 2em;">Register</h1>
    <form
      @submit.prevent="register()"
      style="text-align: center; margin-top: 1em;"
    >
      <div>
        <label for="username">Username</label><br />
        <input v-model="username" type="text" name="username" /><br />
        <small>At least 4 characters.</small><br />
      </div>
      <div style="margin-top: 10px;">
        <label for="password">Password</label><br />
        <input v-model="password" type="password" name="password" /><br />
        <small>At least 6 characters.</small><br />
      </div>
      <div style="margin-top: 10px;">
        <label for="password">Confirm Password</label><br />
        <input v-model="c_password" type="password" name="password" /><br />
        <small>Passwords must match.</small><br />
      </div>
      <p style="color: red; margin-top: 10px; text-align: center;">
        {{ errorMessage }}
      </p>
      <input
        type="submit"
        value="Register"
        style="margin-top: 10px; padding: 3px;"
      />
    </form>
    <div style="text-align: center; margin-top: 15px;">
      <a href="/login">Login?</a>
    </div>
  </div>
</template>

<script>
const validate = require('validate.js');
const axios = require('axios');

const constraints = {
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
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
      c_password: '',
      errorMessage: '',
    };
  },
  methods: {
    async register() {
      if (this.password == this.c_password) {
        // if both passwords are equal
        const body = {
          // take in the username and password
          username: this.username,
          password: this.password,
        };
        const validationError = validate(body, constraints); // validate the body
        if (validationError) {
          // if it failed
          if (validationError.username) {
            this.errorMessage = validationError.username[0]; // error for invalid username
          } else if (validationError.password) {
            this.errorMessage = validationError.password[0]; // error for invalid password
          }
        }
        this.errorMessage = ''; // error message
        try {
          const API_URL = process.env.VUE_APP_REGISTER;
          await axios.post(API_URL, body); // fetch
          this.errorMessage = '';
          this.$router.push('/login');
        } catch (error) {
          // if something went wrong
          this.errorMessage = error.response.data; // display error message
        }
      } else {
        // if passwords didn't match
        this.errorMessage = 'Passwords do not match!';
      }
    },
  },
};
</script>
