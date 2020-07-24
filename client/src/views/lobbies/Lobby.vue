<template>
  <div>
    <h1 style="margin-top: 20px;">Lobbies</h1>
    <Table :lobbies="lobbies" />
    <button @click="create = !create" style="padding: 3px; margin-top: 10px;">
      Create Lobby
    </button>
    <button @click="logout()" style="padding:3px; margin-left: 10px;">
      Logout
    </button>
    <button @click="refresh()" style="padding:3px; margin-left: 10px;">
      Refresh Table
    </button>
    <div v-if="create">
      <form @submit.prevent="createLobby()">
        <input
          v-model="lobbyName"
          type="text"
          placeholder="Lobby Name"
          autocomplete="off"
          style="margin-top: 10px;"
        /><br />
        <input v-model="isPrivate" type="checkbox" style="margin-top: 10px;" />
        Private?
        <br />
        <div v-if="isPrivate">
          <input
            v-model="lobbyPassword"
            type="password"
            placeholder="Lobby Password"
            style="margin-top: 10px;"
          /><br />
        </div>
        <input
          type="submit"
          value="Create"
          style="margin-top: 10px; padding: 3px;"
        />
      </form>
    </div>
    <h4 style="margin-top: 15px;">Currently Online - {{ online - 1 }}</h4>
    <p style="margin-top: 10px; color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
import io from 'socket.io-client';
import Table from './Table';
const axios = require('axios');

export default {
  name: 'Lobby',
  components: {
    Table,
  },
  data() {
    return {
      lobbies: [],
      create: false,
      online: 0,
      lobbyName: '',
      isPrivate: false,
      lobbyPassword: '',
      errorMessage: '',
      socket: io('localhost:5000'),
    };
  },
  created() {
    const API_URL = process.env.VUE_APP_ALL_LOBBIES;
    axios
      .get(API_URL, {
        headers: {
          Authorization: localStorage.token,
        },
      })
      .then((response) => {
        this.lobbies = response.data;
        this.socket.emit('new-auth-client');
      })
      .catch((error) => {
        this.errorMessage = error.response.data;
      });
  },
  methods: {
    createLobby() {
      const API_URL = process.env.VUE_APP_NEW_LOBBY;
      const body = {
        lobbyName: this.lobbyName,
        isPrivate: this.isPrivate,
        lobbyPassword: this.lobbyPassword,
      };
      axios
        .post(API_URL, body, {
          headers: {
            Authorization: localStorage.token,
          },
        })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          this.errorMessage = error.response.data;
        });
    },
    logout() {
      this.socket.emit('logout', { id: this.socket.id });
      localStorage.token = '';
      this.$router.push('/login');
    },
  },
  mounted() {
    this.socket.on('new-connection', () => {
      this.online += 1;
      this.socket.emit('current-users', { totalUsers: this.online });
    });
    this.socket.on('currently-online', (data) => {
      this.online = data.connected;
    });
    this.socket.on('lost-connection', () => {
      this.online -= 1;
    });
  },
};
</script>

<style>
table {
  border-collapse: collapse;
}

td,
th {
  padding: 0.5rem;
  text-align: left;
}

tr {
  border: 1px solid black;
}
</style>
