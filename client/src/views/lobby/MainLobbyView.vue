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
      <form @submit.prevent="switchVideo()" style="margin-top: 40px;">
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
      socket: io('http://ec2-54-158-184-106.compute-1.amazonaws.com:5000'), // listening on
    };
  },
  computed: {
    player() {
      return this.$refs.youtube.player; // youtube player to get access to youtube API functions
    },
  },
  methods: {
    async ready() {
      // when the video is loaded up
      this.videoLength = await this.player.getDuration(); // find the length of the video
    },
    async ended() {
      // when the video ends...
      clearInterval(this.interval); // stop the interval
      this.videoPercentage = 100; // the progress bar should be at 100%
    },
    async playVideo() {
      // when play is clicked
      await this.player.playVideo(); // play video to the user
      this.socket.emit('playing', this.currentLobbyId); // emit event to all clients (in the lobby)
    },
    async pauseVideo() {
      // when pause is clicked
      await this.player.pauseVideo(); // pause video to the user
      this.socket.emit('paused', this.currentLobbyId); // emit event to all clients (in the lobby)
    },
    async switchVideo() {
      // insert a new url and refresh page to display new video
      let newVideoId = this.newVideoURL.split('=')[1]; // parse the youtube URL
      this.newVideoURL = ''; // once it has been parsed set this value to blank again

      if (newVideoId == undefined) {
        // if the url was invalid
        this.errorMessage = 'Invalid URL!'; // set to invalid
      } else {
        // send request to server to update the lobbies current video being watched
        const API_URL = process.env.VUE_APP_CHANGE_VIDEO;
        this.errorMessage = '';
        await axios.put(
          API_URL,
          { newVideoId, lobbyId: this.currentLobbyId },
          { headers: { authorization: localStorage.token } }
        );
        this.socket.emit('new-video', this.currentLobbyId); // emit to all clients a new video has been inserted (in lobby)
      }
    },
    findCursorTime: function(e) {
      let click =
        ((e.clientX - this.$refs.timeline.getBoundingClientRect().left) / 400) *
        100; // get the position of where the mouse clicked in the div
      let newVideoPercentage = click / 160; // find the percentage of where it was clicked
      let newPositionInTimeline = newVideoPercentage * 100; // get the percentage
      this.socket.emit('seek-to', {
        // emit the percentage of where it was clicked to all clients (in lobby)
        newPositionInTimeline,
        currentLobbyId: this.currentLobbyId,
      });
    },
    leaveLobby() {
      // push back to lobbies and send request to remove it from database
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
      // display title of the current lobby
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
    const T_API_URL = process.env.VUE_APP_CURRENTLY_WATCHING;

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
      // on play
      let isValidRequest = await this.inLobby(clientsLobbyId);
      if (isValidRequest) {
        // if it was from a client in the same lobby
        this.interval = setInterval(async () => {
          // start interval
          this.videoLength = await this.player.getDuration();
          let currentTimestamp = await this.player.getCurrentTime();
          let percentage = (currentTimestamp / this.videoLength) * 100;
          if (percentage >= 100) {
            this.videoPercentage = 100;
          } else {
            this.videoPercentage = percentage;
          }
        }, 10);
        this.player.playVideo(); // play video to all clients
      }
    });
    this.socket.on('seeking', async (data) => {
      // on seek
      let currentLobbyId = data.currentLobbyId;
      let isValidRequest = await this.inLobby(currentLobbyId);
      if (isValidRequest) {
        // if it was a client in lobby
        this.videoPercentage = data.newPositionInTimeline;
        let newVideoTime = (this.videoPercentage / 100) * this.videoLength;
        await this.player.seekTo(newVideoTime); // seek to for all clients
        this.socket.emit('playing', currentLobbyId);
      }
    });
    this.socket.on('reload', async (clientsLobbyId) => {
      // on new video
      let isValidRequest = await this.inLobby(clientsLobbyId);
      if (isValidRequest) {
        // if it was from someone in the lobby
        window.location.reload(); // reload
      }
    });
    this.socket.on('pause', async (clientsLobbyId) => {
      // on pause
      let isValidRequest = await this.inLobby(clientsLobbyId); // if paused by someone in the lobby
      if (isValidRequest) {
        clearInterval(this.interval); // stop interval
        this.player.pauseVideo(); // pause
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
