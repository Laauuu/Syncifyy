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
        <tr v-for="lobby in lobbies" :key="lobby._id">
          <td>{{ lobby.title }}</td>
          <td>{{ lobby.owner }}</td>
          <td>{{ lobby.private }}</td>
          <td><a href="#">join</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    lobbies: Array,
  },
};
</script>

<style></style>
