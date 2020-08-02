<template>
  <div
    class="ml-3 rounded"
    :style="{
      width: '35' + '%',
      'margin-top': '4' + 'em',
      height: dashboardHeight + 'px',
      border: '3px solid',
      'border-color': '#e53e3e',
    }"
  >
    <div :class="darkMode ? 'displayDarkHeader' : 'displayLightHeader'">
      <button
        @click="changeChannel('chat')"
        class="bg-blue-600 text-white p-1 rounded-b focus:outline-none hover:bg-blue-500"
      >
        Lobby Chat
      </button>

      <p
        class="bg-green-600 text-white p-1 rounded-b focus:outline-none"
        style="float: right;"
      >
        Watching 0/20
      </p>
    </div>
    <div
      :class="darkMode ? 'displayDarkText' : 'displayLightText'"
      style="border-bottom: 1.5px solid;"
    ></div>
  </div>
</template>

<script>
import Chat from './lobbyDashboardViews/Chat';
import UsersConnected from './lobbyDashboardViews/UsersConnected';

export default {
  name: 'LobbyDashboard',
  props: {
    darkMode: Boolean,
    dashboardHeight: Number,
  },
  components: {
    Chat,
    UsersConnected,
  },
  data() {
    return {
      lobbyChat: true,
    };
  },
  methods: {
    changeChannel(channel) {
      if (channel == 'chat') {
        this.lobbyChat = true;
      }
    },
  },
};
</script>

<style>
.displayDarkHeader {
  background-color: #1a202c;
  padding-bottom: 0.5em;
}

.displayDarkText {
  color: white;
}

.displayLightHeader {
  background-color: #e2e8f0;
  padding-bottom: 0.5em;
}

.displayLightText {
  color: black;
}
</style>
