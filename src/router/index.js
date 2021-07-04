import Vue from 'vue';
import VueRouter from 'vue-router';
import Usuarios from '../views/admin/Usuarios.vue';
import Instituicoes from '../views/admin/Instituicoes.vue';
import Permissoes from '../views/admin/Permissoes.vue';
import Cidades from '../views/admin/Cidades.vue';
import TrabalhosSemAvaliacao from '../views/admin/TrabalhosSemAvaliacao.vue';
import Login from '../views/Login.vue';
import SubmeterProjeto from '../views/admin/SubmeterProjeto.vue';
import Avaliador from '../views/admin/Avaliador.vue';
import CadastroAluno from '../views/admin/CadastroAluno.vue';
import GruposAcesso from '../views/admin/GruposAcesso.vue';
import TrabalhosRecebidos from '../views/admin/TrabalhosRecebidos.vue';
import AvaliacoesEncaminhadas from '../views/admin/AvaliacoesEncaminhadas.vue';

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
    path: '*',
    name: 'entrar',
    component: Login,
    meta: {
      allowAnonymous: true
    }
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
    path: '/grupos',
    name: 'grupos',
    component: GruposAcesso,
    meta: {
      allowAnonymous: false
    },
    beforeEnter: auth
  },
  {
    path: '/cadastre-se',
    name: 'cadastro-aluno',
    component: CadastroAluno,
    meta: {
      allowAnonymous: true
    },
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
    path: '/avaliacoes-encaminhadas',
    name: 'avaliacoes-encaminhadas',
    component: AvaliacoesEncaminhadas,
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
    name: 'trabalhos-recebidos',
    component: TrabalhosRecebidos,
    meta: {
      allowAnonymous: false
    },
    beforeEnter: auth
  },
  {
    path: '/trabalhos-para-encaminhamento',
    name: 'trabalhos',
    component: TrabalhosSemAvaliacao,
    meta: {
      allowAnonymous: false
    },
    beforeEnter: auth
  },
  {
    path: '/avaliacoes',
    name: 'avaliações',
    component: Avaliador,
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
