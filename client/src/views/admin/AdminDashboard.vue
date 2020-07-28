<template>
  <div>
    <div style="width: fit-content;">
      <div style="text-align: center; margin-top: 10px;">
        <h1>Admin Dashboard</h1>

        <h2>Manage Users</h2>
        <li
          v-for="user in users"
          :key="user._id"
          style="font-size: 18px; margin-top: 10px;"
        >
          {{ user.username }}
          <button @click="passwordForm(user._id)">
            change password
          </button>
          <button
            @click="adminDeleteAccount(user._id)"
            style="margin-left: 10px;"
          >
            delete account
          </button>
        </li>
      </div>
      <button @click="redirect()">
        Manage Lobbies
      </button>
      <button @click="adminRefresh()" style="margin-left: 10px;">
        Refresh
      </button>
      <button
        @click="adminLogout()"
        style="margin-top: 10px; margin-left: 10px;"
      >
        Logout
      </button>

      <form
        v-if="showPasswordForm"
        @submit.prevent="adminChangePassword()"
        style="margin-top: 10px;"
      >
        <h2>{{ currentUsername }}</h2>
        <input
          v-model="newPassword"
          :type="showing"
          placeholder="New Password"
          style="margin-bottom: 10px; margin-top: 10px;"
        /><br />
        <input type="submit" value="Confirm" />
        <button
          type="button"
          @click="showing = 'text'"
          style="margin-left: 10px;"
        >
          Show
        </button>
        <button
          type="button"
          @click="showing = 'password'"
          style="margin-left: 10px;"
        >
          Hide
        </button>
        <button type="button" @click="reset()" style="margin-left: 10px;">
          Cancel
        </button>
      </form>
      <p style="color: red; margin-top: 10px;">
        {{ errorMessage }}
      </p>
      <p style="color: green; margin-top: 10px;">
        {{ successMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const validate = require('validate.js');

const constraints = {
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: 'must be at least 6 characters!',
    },
  },
};

export default {
  name: 'AdminDashboard',
  data() {
    return {
      users: [],
      currentUserId: '',
      currentUsername: '',
      showPasswordForm: false,
      showing: 'password',
      newPassword: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  created() {
    const API_URL = process.env.VUE_APP_LIST_USERS;
    axios
      .get(API_URL, {
        headers: {
          Authorization: localStorage.token,
        },
      })
      .then((users) => {
        this.users = users.data;
      })
      .catch((error) => {
        this.errorMessage = error.response.data;
      });
  },
  methods: {
    passwordForm(user_id) {
      this.currentUserId = user_id;
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i]._id == this.currentUserId) {
          this.currentUsername = this.users[i].username;
        }
      }
      this.successMessage = '';
      this.errorMessage = '';
      this.newPassword = '';
      this.showPasswordForm = true;
    },
    reset() {
      this.showPasswordForm = false;
      this.errorMessage = '';
      this.successMessage = '';
      this.newPassword = '';
    },
    redirect() {
      this.$router.push('/admin-dashboard/manage-lobbies');
    },
    adminLogout() {
      localStorage.token = '';
      this.$router.push('/login');
    },
    adminRefresh() {
      const API_URL = process.env.VUE_APP_LIST_USERS;
      axios
        .get(API_URL, {
          headers: {
            Authorization: localStorage.token,
          },
        })
        .then((users) => {
          this.users = users.data;
        })
        .catch((error) => {
          this.errorMessage = error.response.data;
        });
    },
    adminChangePassword() {
      const validationError = validate(
        { password: this.newPassword },
        constraints
      );
      if (validationError) {
        this.errorMessage = validationError.password[0];
      } else {
        this.errorMessage = '';
        const API_URL = process.env.VUE_APP_CHANGE_PASSWORD;
        axios
          .put(
            API_URL,
            { userId: this.currentUserId, newPassword: this.newPassword },
            {
              headers: {
                Authorization: localStorage.token,
              },
            }
          )
          .then((message) => {
            this.successMessage = message.data;
          })
          .catch((error) => {
            this.errorMessage = error.response.data;
          });
      }
    },
    adminDeleteAccount(user_id) {
      const API_URL = process.env.VUE_APP_REMOVE_USER;
      axios
        .delete(API_URL, {
          headers: {
            Authorization: localStorage.token,
          },
          data: {
            userId: user_id,
          },
        })
        .then((message) => {
          this.successMessage = message.data;
        })
        .catch((error) => {
          this.errorMessage = error.response.data;
        });
    },
  },
};
</script>

<style></style>
