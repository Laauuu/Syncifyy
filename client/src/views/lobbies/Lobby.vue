<template>
  <div>
    <h1 style="margin-top: 20px;">Lobbies</h1>
    <table style="margin-top: 10px;">
      <thead>
        <tr>
          <th>Lobby</th>
          <th>Owner</th>
          <th>Private</th>
          <th>Join</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lobby in lobbies" :key="lobby._id">
          <td>{{ lobby.title }}</td>
          <td>{{ lobby.owner }}</td>
          <td>{{ lobby.private }}</td>
          <td><a href="#">join</a></td>
        </tr>
      </tbody>
    </table>
    <button @click="create = !create" style="padding: 3px; margin-top: 10px;">
      Create Lobby
    </button>
    <button @click="logout()" style="padding:3px; margin-left: 10px;">
      Logout
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
    <h4 style="margin-top: 15px;">Currently Online - {{ online }}</h4>
    <p style="margin-top: 10px; color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
const axios = require('axios');

export default {
  name: 'Lobby',
  data() {
    return {
      lobbies: [],
      create: false,
      online: 0,
      lobbyName: '',
      isPrivate: false,
      lobbyPassword: '',
      errorMessage: '',
    };
  },
  methods: {
    createLobby() {
      const API_URL = 'http://127.0.0.1:5000/lobbies/create-lobby';
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
  },
  mounted() {
    const API_URL = 'http://127.0.0.1:5000/lobbies/open-lobbies';
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

/*
<tr>
          <td>Lobby #1</td>
          <td>Username1</td>
          <td>Yes</td>
          <td>Join</td>
          <td>Delete</td>
        </tr>
        <tr>
          <td>Lobby #2</td>
          <td>Username2</td>
          <td>No</td>
          <td>Join</td>
          <td>Delete</td>
        </tr>
        <tr>
          <td>Lobby #3</td>
          <td>Username3</td>
          <td>No</td>
        </tr>
        */
</style>
