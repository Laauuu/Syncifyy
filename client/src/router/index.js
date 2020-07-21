import Vue from 'vue';
import VueRouter from 'vue-router';
import Register from '../views/auth/Register.vue';
import Login from '../views/auth/Login.vue';
import Lobby from '../views/lobbies/Lobby.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Register,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/lobbies',
    name: 'Lobby',
    component: Lobby,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
