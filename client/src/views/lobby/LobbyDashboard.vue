<template>
  <div>
    <div
      class="text-center"
      :style="{
        color: darkMode ? 'white' : 'black',
      }"
    >
      <p class="text-4xl pt-4">Lobby Settings</p>
      <div v-if="!permissionToEdit" class="text-2xl mb-4 mt-4">
        You do not have permission to edit this lobby!
      </div>
      <div v-if="permissionToEdit" class="text-2xl mb-4 mt-4">
        <button
          class="bg-green-600 p-1 text-white focus:outline-none rounded hover:bg-green-500"
          style="border: 1.5px solid gray;"
        >
          Change Lobby Name</button
        ><br />
        <button
          class="mt-3 bg-green-600 p-1 text-white focus:outline-none rounded hover:bg-green-500"
          style="border: 1.5px solid gray;"
        >
          Change Lobby Status</button
        ><br />
        <button
          class="mt-3 bg-blue-600 p-1 text-white focus:outline-none rounded hover:bg-blue-500"
          style="border: 1.5px solid gray;"
        >
          Kick User</button
        ><br />
        <button
          class="mt-3 bg-blue-600 p-1 text-white focus:outline-none rounded hover:bg-blue-500"
          style="border: 1.5px solid gray;"
        >
          Ban User (coming soon!)</button
        ><br />
        <button
          class="mt-5 bg-red-700 text-white p-1 rounded focus:outline-none hover:bg-red-600"
          style="border: 1.5px solid gray;"
        >
          Remove Lobby
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LobbyDashboard',
  props: {
    darkMode: Boolean,
    currentLobbyId: String,
  },
  data() {
    return {
      permissionToEdit: false,
    };
  },
};
</script>

<style></style>
