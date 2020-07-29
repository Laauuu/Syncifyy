import axios from 'axios';

const state = {
  lobbies: [],
  lobbiesAdmin: [],
};

const getters = {
  allLobbies: (state) => state.lobbies,
  allLobbiesAdmin: (state) => state.lobbiesAdmin,
};

const actions = {
  async fetchLobbies({ commit }) {
    const API_URL = process.env.VUE_APP_ALL_LOBBIES;
    const response = await axios.get(API_URL, {
      headers: { Authorization: localStorage.token },
    });
    commit('setLobbies', response.data);
  },
  async fetchLobbiesAdmin({ commit }) {
    const API_URL = process.env.VUE_APP_LIST_LOBBIES;
    const response = await axios.get(API_URL, {
      headers: { Authorization: localStorage.token },
    });
    commit('setLobbiesAdmin', response.data);
  },
};

const mutations = {
  setLobbies: (state, lobbies) => (state.lobbies = lobbies),
  setLobbiesAdmin: (state, lobbiesAdmin) => (state.lobbiesAdmin = lobbiesAdmin),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
