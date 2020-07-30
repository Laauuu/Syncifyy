<template>
  <div>
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
        <tr v-for="lobby in lobbies" :key="lobby.uuid">
          <td>{{ lobby.title }}</td>
          <td>{{ lobby.owner }}</td>
          <td>{{ lobby.private }}</td>
          <td>
            <button
              @click="checkIfPrivate(lobby.private, lobby.password, lobby.uuid)"
            >
              Join
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <form
      v-if="validatePassword"
      @submit.prevent="redirectIfCorrect()"
      style="margin-top: 10px;"
    >
      <input
        type="password"
        v-model="passwordInput"
        placeholder="Insert Password"
      />
      <input type="Submit" value="Submit" style="margin-left: 10px;" />
      <input
        type="button"
        @click="cancel()"
        value="Cancel"
        style="margin-left: 10px"
      />
    </form>
    <p style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    lobbies: Array,
  },
  data() {
    return {
      validatePassword: false,
      password: '',
      lobbyId: '',
      passwordInput: '',
      errorMessage: '',
    };
  },
  methods: {
    checkIfPrivate(privateLobby, password, lobbyId) {
      // checks if the lobby is private
      if (privateLobby === 'true') {
        this.validatePassword = true;
        this.password = password;
        this.lobbyId = lobbyId;
      } else {
        this.password = '';
        this.validatePassword = false;
        this.$router.push(`/lobbies/${lobbyId}`);
      }
    },
    redirectIfCorrect() {
      // if the password inserted was correct..
      if (this.passwordInput == this.password) {
        this.errorMessage = '';
        this.$router.push(`/lobbies/${this.lobbyId}`); // send to lobby
      } else {
        this.errorMessage = 'Invalid Password!'; // invalid password
      }
    },
    cancel() {
      // clear out of form, reset data
      this.password = '';
      this.lobbyId = '';
      this.passwordInput = '';
      this.errorMessage = '';
      this.validatePassword = false;
    },
  },
};
</script>
