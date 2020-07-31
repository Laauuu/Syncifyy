<template>
  <div id="app">
    <head>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap"
        rel="stylesheet"
      />
    </head>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="danger">
        <b-navbar-brand href="/" style="font-family: 'Roboto', sans-serif;"
          >YouTube Sync</b-navbar-brand
        >

        <div class="ml-auto">
          <button
            v-if="darkMode"
            @click="swapScheme()"
            class="p-2 rounded focus:outline-none text-black bg-white"
          >
            Light Mode
          </button>
          <button
            v-if="!darkMode"
            @click="swapScheme()"
            class="p-2 rounded focus:outline-none text-white bg-black"
          >
            Dark Mode
          </button>
        </div>
      </b-navbar>
    </div>
    <router-view />
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: 'App',
  data() {
    return {
      darkMode: false,
    };
  },
  methods: {
    swapScheme() {
      this.darkMode = !this.darkMode;
      localStorage.darkMode = this.darkMode;
    },
  },
  created() {
    if (localStorage.darkMode == undefined) {
      localStorage.darkMode = false;
    }
  },
};

/*
VUE_APP_LOGIN = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/auth/login
VUE_APP_REGISTER = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/auth/register

VUE_APP_ALL_LOBBIES = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/lobbies/open-lobbies
VUE_APP_NEW_LOBBY = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/lobbies/create-lobby

VUE_APP_USER_LOBBY = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/lobby/user-lobby

VUE_APP_ASSIGN_LOBBY = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/lobby/assign-lobby
VUE_APP_LEAVE_LOBBY = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/lobby/leave-lobby

VUE_APP_CURRENTLY_WATCHING = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/lobby/currently-watching
VUE_APP_CHANGE_VIDEO = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/lobby/change-video

VUE_APP_ADMIN_USERNAME = admin
VUE_APP_ADMIN_PASSWORD = adminpassword
VUE_APP_ADMIN_TOKEN = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

VUE_APP_LIST_USERS = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/admin/list-users
VUE_APP_CHANGE_PASSWORD = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/admin/change-password
VUE_APP_REMOVE_USER = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/admin/remove-user

VUE_APP_LIST_LOBBIES = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/admin/list-lobbies
VUE_APP_EDIT_LOBBY = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/admin/change-lobby
VUE_APP_DELETE_LOBBY = http://ec2-54-158-184-106.compute-1.amazonaws.com:5000/admin/delete-lobby
*/
</script>
<style>
@import './css/tailwind.css';

* {
  margin: 0px;
  padding: 0px;
}
</style>
