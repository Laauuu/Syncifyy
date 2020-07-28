<template>
  <div>
    <h1 style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
      {{ lobbyTitle
      }}<button @click="leaveLobby()" style="margin-left: 10px; padding: 3px;">
        Leave Lobby
      </button>
    </h1>
    <div style="margin: 0 auto; width: fit-content;">
      <youtube
        :video-id="videoId"
        :playerVars="playerVars"
        @ready="ready"
        @ended="ended"
        ref="youtube"
        style="pointer-events: none;"
      ></youtube>
      <br />
      <button @click="playVideo" style="margin-top: 10px;">Play</button>
      <button @click="pauseVideo" style="margin-top: 10px; margin-left: 10px;">
        Pause
      </button>
      <div @click="findCursorTime($event)" class="timeline" ref="timeline">
        <div
          v-bind:style="{ width: videoPercentage + '%' }"
          class="timeline-positiion"
        ></div>
      </div>
      <form style="margin-top: 40px;" @submit.prevent="switchVideo()">
        <input
          v-model="newVideoURL"
          type="text"
          style="width: 50%; padding: 2px;"
          placeholder="Insert Youtube URL"
        />
        <input
          type="submit"
          value="Play Video"
          style="margin-left: 10px; padding: 2px;"
        />
      </form>
      <p style="margin-top: 10px; color: red;">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const axios = require('axios');

export default {
  name: 'MainLobbyView',
  data() {
    return {
      lobbyTitle: '',
      currentLobbyId: null,
      videoId: '',
      newVideoURL: null,
      playerVars: {
        controls: 0,
        disablekb: 1,
        rel: 0,
        modestbranding: 1,
      },
      videoLength: 0,
      videoPercentage: 0,
      errorMessage: '',
      socket: io('localhost:5000'),
    };
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
  },
  methods: {
    async ready() {
      this.videoLength = await this.player.getDuration();
    },
    async ended() {
      clearInterval(this.interval);
      this.videoPercentage = 100;
    },
    async playVideo() {
      await this.player.playVideo();
      this.socket.emit('playing', this.currentLobbyId);
    },
    async pauseVideo() {
      await this.player.pauseVideo();
      this.socket.emit('paused', this.currentLobbyId);
    },
    async switchVideo() {
      let newVideoId = this.newVideoURL.split('=')[1];
      this.newVideoURL = '';

      if (newVideoId == undefined) {
        this.errorMessage = 'Invalid URL!';
      } else {
        const API_URL = 'http://127.0.0.1:5000/lobby/change-video';
        this.errorMessage = '';
        await axios.put(
          API_URL,
          { newVideoId, lobbyId: this.currentLobbyId },
          { headers: { authorization: localStorage.token } }
        );
        this.socket.emit('new-video', this.currentLobbyId);
      }
    },
    findCursorTime: function(e) {
      let click =
        ((e.clientX - this.$refs.timeline.getBoundingClientRect().left) / 400) *
        100;
      let newVideoPercentage = click / 160;
      let newPositionInTimeline = newVideoPercentage * 100;
      this.socket.emit('seek-to', {
        newPositionInTimeline,
        currentLobbyId: this.currentLobbyId,
      });
    },
    leaveLobby() {
      const API_URL = process.env.VUE_APP_LEAVE_LOBBY;
      axios
        .put(API_URL, {}, { headers: { authorization: localStorage.token } })
        .then(() => {
          this.$router.push('/lobbies');
        })
        .catch((error) => {
          this.errorMessage = error.response.data;
        });
    },
    async inLobby(clientsLobbyId) {
      const response = await axios.get(process.env.VUE_APP_ALL_LOBBIES, {
        headers: { authorization: localStorage.token },
      });

      let lobbies = response.data;
      for (var i = 0; i < lobbies.length; i++) {
        if (lobbies[i]._id == this.currentLobbyId) {
          if (clientsLobbyId == lobbies[i]._id) {
            return true;
          }
        }
      }
      return false;
    },
  },
  created() {
    const API_URL = process.env.VUE_APP_ALL_LOBBIES;
    const S_API_URL = process.env.VUE_APP_ASSIGN_LOBBY;
    const T_API_URL = 'http://127.0.0.1:5000/lobby/currently-watching';

    const currRouteId = this.$router.currentRoute.path.split('/')[2];

    axios
      .get(API_URL, {
        headers: {
          Authorization: localStorage.token,
        },
      })
      .then((response) => {
        const lobbies = response.data;
        for (var i = 0; i < lobbies.length; i++) {
          if (lobbies[i]._id == currRouteId) {
            this.lobbyTitle = lobbies[i].title;
            this.currentLobbyId = lobbies[i]._id;
          }
        }
        axios
          .post(
            T_API_URL,
            { lobbyId: this.currentLobbyId },
            { headers: { authorization: localStorage.token } }
          )
          .then((watching) => {
            this.videoId = watching.data;
          });
      })
      .catch((error) => {
        this.errorMessage = error.response.data;
      });

    axios.put(
      S_API_URL,
      { lobbyId: currRouteId },
      { headers: { authorization: localStorage.token } }
    );
  },
  mounted() {
    this.socket.on('play', async (clientsLobbyId) => {
      let isValidRequest = await this.inLobby(clientsLobbyId);
      if (isValidRequest) {
        this.interval = setInterval(async () => {
          this.videoLength = await this.player.getDuration();
          let currentTimestamp = await this.player.getCurrentTime();
          let percentage = (currentTimestamp / this.videoLength) * 100;
          if (percentage >= 100) {
            this.videoPercentage = 100;
          } else {
            this.videoPercentage = percentage;
          }
        }, 10);
        this.player.playVideo();
      }
    });
    this.socket.on('seeking', async (data) => {
      let currentLobbyId = data.currentLobbyId;
      let isValidRequest = await this.inLobby(currentLobbyId);
      if (isValidRequest) {
        this.videoPercentage = data.newPositionInTimeline;
        let newVideoTime = (this.videoPercentage / 100) * this.videoLength;
        await this.player.seekTo(newVideoTime);
        this.socket.emit('playing', currentLobbyId);
      }
    });
    this.socket.on('reload', async (clientsLobbyId) => {
      let isValidRequest = await this.inLobby(clientsLobbyId);
      if (isValidRequest) {
        window.location.reload();
      }
    });
    this.socket.on('pause', async (clientsLobbyId) => {
      let isValidRequest = await this.inLobby(clientsLobbyId);
      if (isValidRequest) {
        clearInterval(this.interval);
        this.player.pauseVideo();
      }
    });
  },
};
</script>

<style>
.timeline {
  position: relative;
  margin-top: 20px;
  height: 10px;
  background-color: gray;
  border: 1px solid red;
}

.timeline-positiion {
  height: 10px;
  background-color: yellow;
}
</style>
