<template>
  <v-card class="mx-auto pl-6 pr-6 mt-16" min-width="400" outlined>
    <v-list-item class="center">
      <v-list-item-avatar tile size="200">
        <v-img
          alt="UEMS - Controle de projetos"
          class="shrink mr-2"
          contain
          :src="require('../../public/img/logo.png')"
          transition="scale-transition"
          width="200"
        />
      </v-list-item-avatar>
    </v-list-item>

    <v-form ref="form">
      <v-text-field
        v-model="email"
        label="Email:"
        :disabled="carregando"
        required
        :error-messages="error.email"
      ></v-text-field>

      <v-text-field
        v-model="senha"
        label="Senha:"
        :disabled="carregando"
        :error-messages="error.senha"
        type="password"
        required
      ></v-text-field>

      <v-btn
        color="#07759e"
        block
        type="submit"
        class="mr-4 mt-4 mb-10 white--text"
        :loading="carregando"
        @click="logar"
        :disabled="!email || !senha || carregando"
      >
        Entrar
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
import axios from "../../axios/service_public.js";

export default {
  name: "login",
  data: () => ({
    email: null,
    senha: null,
    carregando: false,
    error: {
      email: null,
      senha: null,
    },
  }),
  methods: {
    clear() {
      this.error = {
        email: null,
        senha: null,
      };
    },
    logar() {
      this.carregando = true;
      axios
        .post("/api/v1/auth/entrar", {
          email: this.email,
          senha: this.senha,
        })
        .then((res) => {
          if (res.data.status) {
            try {
              window.localStorage.setItem("token_uems", res.data.token);
              window.localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
              );
              window.localStorage.setItem(
                "menuLateral",
                JSON.stringify(res.data.menu)
              );
              let redirect = setInterval(() => {
                let menu = JSON.parse(localStorage.getItem("menuLateral"));

                if(menu && menu.length > 0){
                  this.$router.push({ path: menu[0].rota_web });
                }else{
                  this.$router.push({ path: "/" });
                }

                this.$router.go();
                this.clear();
                this.carregando = false;
                clearInterval(redirect);
              }, 1000);
            } catch (e) {
              return false;
            }
          }
        })
        .catch((res) => {
          if (res.response.data && res.response.data.validation) {
            this.error = res.response.data.validation;
            this.$toast.open({
              message: "Não foi possivel acessar o sistema, acesso negado!",
              type: "error",
            });
            this.carregando = false;
          } else {
            this.$toast.open({
              message: res.response.data.message,
              type: "error",
            });
            this.carregando = false;
          }
        });
    },
  },
};
</script>

<style  scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.color {
  color: rgba(255, 255, 255, 0.9) !important;
}
</style>