<template>
  <div class="Register">
    <h1 style="text-align: center; margin-top: 2em;">Register</h1>
    <form
      style="text-align: center; margin-top: 1em;"
      @submit.prevent="register()"
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
    register() {
      if (this.password == this.c_password) {
        const body = {
          username: this.username,
          password: this.password,
        };
        const validationError = validate(body, constraints);
        if (validationError) {
          if (validationError.username) {
            this.errorMessage = validationError.username[0];
          } else if (validationError.password) {
            this.errorMessage = validationError.password[0];
          }
        }
        this.errorMessage = '';
        // api call
      } else {
        this.errorMessage = 'Passwords do not match!';
      }
    },
  },
};
</script>
