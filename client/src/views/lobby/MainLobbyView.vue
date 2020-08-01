<template>
  <div>
    <div class="flex justify-center mt-3 mb-3">
      <button
        class="mr-3 text-red-600 focus:outline-none"
        @click="leaveLobby()"
      >
        <i class="fa fa-arrow-circle-left" style="font-size:26px;"></i>
      </button>
      <p class="text-4xl">{{ lobbyTitle }}</p>
      <button
        v-if="!darkMode"
        @click="darkMode = true"
        class="ml-3 text-black focus:outline-none"
      >
        <i class="fa fa-moon-o" style="font-size:26px;"></i>
      </button>
      <button
        v-if="darkMode"
        @click="darkMode = false"
        class="ml-3 text-yellow-500 focus:outline-none"
      >
        <i class="fa fa-sun-o" style="font-size:26px;"></i>
      </button>
    </div>
    <div>
      <div class="flex justify-center">
        <youtube
          v-if="!fullScreen"
          :video-id="videoId"
          :playerVars="playerVars"
          @ready="ready"
          @ended="ended"
          ref="youtube"
          style="pointer-events: none;"
        ></youtube>
        <youtube
          v-if="fullScreen"
          :video-id="videoId"
          :playerVars="playerVars"
          :width="frameWidth"
          :height="frameHeight"
          @ready="ready"
          @ended="ended"
          ref="youtube"
          style="pointer-events: none;"
        ></youtube>
      </div>
      <div class="flex items-center justify-center mt-4">
        <button
          @click="playVideo"
          class="p-1 pl-2 pr-2 border-black rounded bg-red-600 focus:outline-none hover:bg-red-500 text-white"
          style="border: 1.5px solid black;"
        >
          <i class="fa fa-play" style="font-size: 20px;"></i>
        </button>
        <button
          @click="pauseVideo"
          class="p-1 pl-2 pr-2 border-black rounded bg-red-600 focus:outline-none hover:bg-red-500 text-white ml-2"
          style="border: 1.5px solid black;"
        >
          <i class="fa fa-pause"></i>
        </button>
        <div class="timeline">
          <div class="timeline-cursor"></div>
        </div>
        <button
          @click="fullScreen = !fullScreen"
          class="ml-2 p-1 pl-2 pr-2 border-black rounded bg-red-600 focus:outline-none hover:bg-red-500 text-white"
          style="border: 1.5px solid black;"
        >
          <i class="fa fa-expand" style="font-size:20px;"></i>
        </button>
      </div>

      <form @submit.prevent="switchVideo()" class="mt-2 text-center">
        <input
          v-model="newVideoURL"
          type="text"
          style="width: 20%;"
          class="focus:outline-none border-b"
          placeholder="Insert Youtube URL"
        />
        <input
          type="submit"
          value="Play Video"
          class="ml-3 p-1 rounded bg-red-600 text-white focus:outline-none hover:bg-red-500"
          style="border: 1.5px solid black;"
        />
      </form>
      <p class="text-red-600 text-center">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';

export default {
  name: 'MainLobbyView',
  data() {
    return {
      lobbyTitle: '',
      currentLobbyId: null,
      videoId: '',
      newVideoURL: null,
      fullScreen: false,
      frameHeight: 0,
      frameWidth: 0,
      playerVars: {
        controls: 0,
        disablekb: 1,
        rel: 0,
        modestbranding: 1,
      },
      videoLength: 0,
      videoPercentage: 0,
      darkMode: false,
      errorMessage: '',
      socket: io('localhost:5001'), // listening on http://ec2-54-158-184-106.compute-1.amazonaws.com:5000
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
      const newVideo = this.$youtube.getIdFromUrl(this.newVideoURL);
      if (newVideo == null) {
        this.errorMessage = 'Invalid URL!'; // add timeout
      } else {
        this.errorMessage = '';
        try {
          const API_URL = 'http://127.0.0.1:5001/lobby/change-video';
          await axios.put(
            API_URL,
            { lobbyId: this.currentLobbyId, newVideoId: newVideo },
            { headers: { authorization: localStorage.token } }
          );
          this.socket.emit('new-video', this.currentLobbyId); // emit to all clients a new video has been inserted (in lobby)
        } catch (error) {
          this.errorMessage = error.response.data;
        }
      }
    },
    findCursorTime: function(e) {
      // EDIT EDIT EDIT
      this.socket.emit('seek-to', {
        newPositionInTimeline: 50, // change
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
        if (lobbies[i].uuid == this.currentLobbyId) {
          if (clientsLobbyId == lobbies[i].uuid) {
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
          if (lobbies[i].uuid == currRouteId) {
            this.lobbyTitle = lobbies[i].title;
            this.currentLobbyId = lobbies[i].uuid;
          }
        }

        axios
          .post(
            T_API_URL,
            {
              lobbyId: this.currentLobbyId,
            },
            {
              headers: {
                authorization: localStorage.token,
              },
            }
          )
          .then((videoId) => {
            this.videoId = videoId.data;
          });
      });

    axios.put(
      S_API_URL,
      { lobbyId: currRouteId },
      { headers: { authorization: localStorage.token } }
    );

    this.frameHeight = screen.height - 350;
    this.frameWidth = screen.width - 200;
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
  height: 10px;
  width: 40%;
  margin-left: 10px;
  background-color: rgb(240, 240, 240);
}

.timeline-cursor {
  background-color: red;
  width: 0%;
  height: 10px;
  border-right: 2px solid;
}

/*
let widthOfDiv = this.$refs.timeline.offsetWidth;
      console.log(this.$refs.timeline.getBoundingClientRect());
      let click =
        ((e.clientX - ) / 400) *
        100; // get the position of where the mouse clicked in the div
      let newVideoPercentage = click / 160; // find the percentage of where it was clicked
      let newPositionInTimeline = newVideoPercentage * 100; // get the percentage
      */
/*

<div @click="findCursorTime($event)" class="timeline" ref="timeline">
        <div
          v-bind:style="{ width: videoPercentage + '%' }"
          class="timeline-positiion"
        ></div>
      </div>

*/
</style>
