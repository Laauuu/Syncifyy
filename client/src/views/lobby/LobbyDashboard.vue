<template>
  <div>
    <div
      class="w-full pb-1"
      :style="{
        'border-bottom': darkMode ? '3px solid white' : '3px solid black',
        'background-color': darkMode ? '#1a202c' : 'white',
      }"
    >
      <div class="flex">
        <button
          class="p-1 bg-green-600 text-white rounded-b hover:bg-green-500 focus:outline-none"
        >
          Watching: 0
        </button>
        <button
          class="p-1 bg-blue-600 text-white rounded-b ml-2 focus:outline-none hover:bg-blue-500"
        >
          Lobby Chat
        </button>
        <button
          class="p-1 bg-blue-600 text-white rounded-b ml-2 focus:outline-none hover:bg-blue-500"
        >
          Private Chat (Coming Soon!)
        </button>
        <button
          class="p-1 bg-blue-600 text-white rounded-b ml-2 focus:outline-none hover:bg-blue-500"
        >
          Voice Chat (Coming Soon!)
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LobbyDashboard',
  props: {
    darkMode: Boolean,
    currentLobbyId: String,
  },
};
</script>

<style></style>
