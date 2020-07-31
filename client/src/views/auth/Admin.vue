<template>
  <div>
    <h1 style="text-align: center; margin-top: 2em;">Admin Login</h1>
    <form
      @submit.prevent="adminLogin()"
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
      <a href="/">Login?</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      errorMessage: '',
      username: '',
      password: '',
    };
  },
  methods: {
    adminLogin() {
      if (this.username == process.env.VUE_APP_ADMIN_USERNAME) {
        // if username == to admin username
        if (this.password == process.env.VUE_APP_ADMIN_PASSWORD) {
          // if password == to admin password
          localStorage.token = process.env.VUE_APP_ADMIN_TOKEN; // assign the admin token
          this.$router.push('/admin-dashboard'); // push to admin dashboard
        } else {
          this.errorMessage = 'Username / Password is invalid.'; // wrong credentials
        }
      } else {
        this.errorMessage = 'Username / Password is invalid.'; // wrong credentials
      }
    },
  },
};
</script>
