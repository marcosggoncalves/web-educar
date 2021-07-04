<template>
  <div>
    <v-app v-if="$route.meta.allowAnonymous">
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </v-app>
    <v-app v-else>
      <v-navigation-drawer expand-on-hover app>
        <v-list dense>
          <v-list-item-group v-model="selectedItem" color="#07759e">
            <v-list-item
              v-for="(item, index) in menu"
              :key="index"
              link
              @click="redirecionar(`${item.rota_web}`)"
            >
              <v-list-item-icon>
                <v-icon>{{
                  item.icon != null ? item.icon : "mdi-plus"
                }}</v-icon>
              </v-list-item-icon>

              <v-list-item-title>
                <b>{{ item.nome }}</b>
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar
        app
        color="rgba(255,255,255,0.9)"
        dark
        fixed
        scroll-target="#scrolling-techniques-4"
      >
        <div class="d-flex align-center auto">
          <v-toolbar-title></v-toolbar-title>

          <v-spacer></v-spacer>

          <v-img
            alt="UEMS"
            class="shrink mr-2"
            contain
            :src="require('../public/img/logo.png')"
            width="120"
          />
        </div>

        <v-spacer></v-spacer>
        <v-menu bottom width="100" rounded offset-y class="pr-8">
          <template v-slot:activator="{ on }">
            <v-btn icon x-large v-on="on">
              <v-avatar color="#07759e" class="white--text" size="40">
                {{ namePerfil() }}
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar color="#07759e" class="mb-2">
                  <span class="white--text headline">{{ namePerfil() }}</span>
                </v-avatar>
                <p class="caption mt-1">
                  {{ user.email }}
                </p>
                <v-divider class="my-3"></v-divider>
                <v-btn text>
                  Grupo acesso: <b>{{ user.nome }}</b>
                </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn text @click="sair()" color="error">
                  Finalizar Sessão
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <transition>
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </transition>
        </v-container>
      </v-main>
      <v-footer
        relative
        class="font-weight-medium mt-9"
        color="light-green lighten-5"
      >
        <v-col class="text-center" cols="12">
          <strong>UEMS - <b class="font-footer">Versão 1.0.0</b></strong>
        </v-col>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "App",
  data: () => ({
    menu: [],
    selectedItem: 0,
    user: [],
  }),
  methods: {
    redirecionar(route) {
      this.$router.push({ path: route });
    },
    namePerfil() {
      if (this.user && !this.user.nome) return "UE";
      return (
        this.user.nome[0] + this.user.nome[this.user.nome.length - 1]
      ).toUpperCase();
    },
    sair() {
      Swal.fire({
        title: `Finalizar Sessão!`,
        text: `Deseja encerra seu acesso ao sistema?`,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#07759e",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: `Sim, pode finalizar`,
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: `Sessão finalizada!`,
            text: `Você será redirecionado para a tela de login.`,
            icon: "sucess",
            showCancelButton: false,
            reverseButtons: true,
            showConfirmButton: false,
          });
          let redirect = setInterval(() => {
            this.$router.push({ path: "/entrar" });
            this.$router.go();
            this.clear();
            this.carregandoSave = false;
            clearInterval(redirect);
          }, 1500);
          // this.$router.go();
          window.localStorage.clear();
        }
      });
    },
  },
  mounted() {
    this.menu = JSON.parse(localStorage.getItem("menuLateral"));
    this.user = JSON.parse(localStorage.getItem("user"));

    if (this.user && this.user.id) this.$store.dispatch("verifyToken");
  },
};
</script>
