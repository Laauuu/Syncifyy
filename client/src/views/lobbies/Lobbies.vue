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
    <p style="margin-top: 10px; color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
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
      lobbyName: '',
      isPrivate: false,
      lobbyPassword: '',
      errorMessage: '',
    };
  },
  created() {
    const API_URL = process.env.VUE_APP_ALL_LOBBIES;
    const S_API_URL = 'http://127.0.0.1:5000/lobby/user-lobby';

    axios
      .get(S_API_URL, { headers: { authorization: localStorage.token } })
      .then((lobby) => {
        if (lobby.data != null) {
          this.$router.push(`/lobbies/${lobby.data}`);
        }
      })
      .catch((error) => {
        this.errorMessage = error.response.data;
      });

    axios
      .get(API_URL, {
        headers: {
          Authorization: localStorage.token,
        },
      })
      .then((response) => {
        this.lobbies = response.data;
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
      localStorage.token = '';
      this.$router.push('/login');
    },
    refresh() {
      const API_URL = process.env.VUE_APP_ALL_LOBBIES;

      axios
        .get(API_URL, {
          headers: {
            Authorization: localStorage.token,
          },
        })
        .then((response) => {
          this.lobbies = response.data;
        })
        .catch((error) => {
          this.errorMessage = error.response.data;
        });
    },
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
