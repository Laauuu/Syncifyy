<template>
  <div>
    <h1 style="text-align: center; margin-top: 2em;">Admin Login</h1>
    <form
      style="text-align: center; margin-top: 1em;"
      @submit.prevent="adminLogin()"
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
      <a href="/login">Login?</a>
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
        if (this.password == process.env.VUE_APP_ADMIN_PASSWORD) {
          localStorage.token = process.env.VUE_APP_ADMIN_TOKEN;
          this.$router.push('/admin-dashboard');
        } else {
          this.errorMessage = 'Username / Password is invalid.';
        }
      } else {
        this.errorMessage = 'Username / Password is invalid.';
      }
    },
  },
};
</script>

<style></style>
