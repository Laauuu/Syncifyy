<template>
  <div>
    <h1 style="margin-top: 20px;">Lobbies</h1>
    <Table :lobbies="allLobbies" />
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
import { mapGetters, mapActions } from 'vuex';

import axios from 'axios';
import validate from 'validate.js';

export default {
  name: 'Lobby',
  components: {
    Table,
  },
  data() {
    return {
      create: false,
      lobbyName: '',
      isPrivate: false,
      lobbyPassword: '',
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters(['allLobbies']), // getters from vuex (all lobbies)
  },
  created() {
    const API_URL = process.env.VUE_APP_USER_LOBBY;

    axios // this AJAX request just makes sure that the user isn't already in a lobby and if so redirect user to lobby
      .get(API_URL, { headers: { authorization: localStorage.token } })
      .then((lobby) => {
        if (lobby.data != null) {
          this.$router.push(`/lobbies/${lobby.data}`);
        }
      })
      .catch((error) => {
        this.errorMessage = error.response.data;
      });

    this.fetchLobbies(); // fetch lobby data
  },
  methods: {
    ...mapActions(['fetchLobbies']), // actions from vuex (send request to get lobby data)

    async createLobby() {
      // take user input and insert new lobby in database
      const API_URL = process.env.VUE_APP_NEW_LOBBY;
      const body = {
        lobbyName: this.lobbyName,
        isPrivate: this.isPrivate,
        lobbyPassword: this.lobbyPassword,
      };
      try {
        // send request to server
        await axios.post(API_URL, body, {
          headers: { authorization: localStorage.token },
        });
        window.location.reload(); // after it updated in the database refresh window
      } catch (error) {
        // if for some reason there was a bug
        this.errorMessage = error.response.data; // display error
      }
    },
    logout() {
      // go back to login page
      localStorage.token = '';
      this.$router.push('/');
    },
    refresh() {
      // refresh to get new updates
      this.fetchLobbies(); // re-fetch data
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
