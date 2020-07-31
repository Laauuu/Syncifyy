<template>
  <div>
    <button
      @click="logout()"
      class="text-xl bg-gray-800 p-2 rounded-br text-white"
    >
      Logout
    </button>
    <div class="flex justify-center mt-4 items-center">
      <div class="mr-3 text-xl">
        <button
          @click="refresh()"
          class="bg-red-600 text-white p-1 rounded focus:outline-none"
        >
          Refresh Table
        </button>
      </div>
      <div class="text-5xl">
        Lobbies
      </div>
      <div class="ml-3 text-xl">
        <button
          @click="create = !create"
          class="bg-red-600 text-white p-1 rounded focus:outline-none"
        >
          Create Lobby
        </button>
      </div>
    </div>

    <Table :lobbies="allLobbies" />

    <div v-if="create">
      <form @submit.prevent="createLobby()">
        <input
          v-model="lobbyName"
          type="text"
          placeholder="Lobby Name"
          autocomplete="off"
        /><br />
        <input v-model="isPrivate" type="checkbox" />
        Private?
        <br />
        <div v-if="isPrivate">
          <input
            v-model="lobbyPassword"
            type="password"
            placeholder="Lobby Password"
          /><br />
        </div>
        <input type="submit" value="Create" />
      </form>
    </div>
    <p>{{ errorMessage }}</p>
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
