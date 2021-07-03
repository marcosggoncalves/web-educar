import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Usuarios from '../views/admin/Usuarios.vue';
import Instituicoes from '../views/admin/Instituicoes.vue';
import Permissoes from '../views/admin/Permissoes.vue';
import Cidades from '../views/admin/Cidades.vue';
import Trabalhos from '../views/admin/Trabalhos.vue';
import Login from '../views/Login.vue';
import SubmeterProjeto from '../views/admin/SubmeterProjeto.vue';


Vue.use(VueRouter)

const auth = async (to, from, next) => {
  let token = window.localStorage.getItem('token_uems');

  if (!token) {
    return next('/entrar');
  }

  next();
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      allowAnonymous: false
    },
    beforeEnter: auth
  },

  {
    path: '/usuarios',
    name: 'usuarios',
    component: Usuarios,
    meta: {
      allowAnonymous: false
    },
    beforeEnter: auth
  },

  {
    path: '/submeter-projeto',
    name: 'submeter-projeto',
    component: SubmeterProjeto,
    meta: {
      allowAnonymous: false
    },
    beforeEnter: auth
  },

  {
    path: '/cidades',
    name: 'cidades',
    component: Cidades,
    meta: {
      allowAnonymous: false
    },
    beforeEnter: auth
  },

  {
    path: '/instituicoes',
    name: 'instituicoes',
    component: Instituicoes,
    meta: {
      allowAnonymous: false
    },
    beforeEnter: auth
  },

  {
    path: '/permissoes',
    name: 'permissoes',
    component: Permissoes,
    meta: {
      allowAnonymous: false
    },
    beforeEnter: auth
  },

  {
    path: '/trabalhos-recebidos',
    name: 'trabalhos',
    component: Trabalhos,
    meta: {
      allowAnonymous: false
    },
    beforeEnter: auth
  },
  {
    path: '/entrar',
    name: 'login',
    component: Login,
    meta: {
      allowAnonymous: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
