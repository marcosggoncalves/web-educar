<template>
  <v-card elevation="0" class="mx-auto pl-6 pr-6 mt-10" min-width="400" outlined>
    <v-list-item class="center d-flex align-center justify-center">
      <v-list-item-avatar tile size="300" height="100">
        <v-img
          alt="UEMS - Controle de projetos"
          class="shrink ml-8"
          contain
          :src="require('../../../public/img/logo.png')"
          transition="scale-transition"
          width="250"
        />
      </v-list-item-avatar>
    </v-list-item>
    <h3 class="text-center">Cadastre-se para submeter o projeto!</h3>
    <v-form ref="form" class="pa-4 mx-auto form">
      <v-text-field
        v-model="usuario.nome"
        label="Nome:"
        required
        dense
        outlined
        :error-messages="error.nome"
      ></v-text-field>

      <v-text-field
        v-model="usuario.email"
        label="Email:"
        required
        :error-messages="error.email"
        dense
        outlined
      ></v-text-field>

      <v-autocomplete
        :items="instituicoes"
        label="Instituição"
        v-model="usuario.instituicao_id"
        item-value="id"
        item-text="nome"
        auto-select-first
        chips
        clearable
        dense
        deletable-chips
        :error-messages="error.instituicao_id"
        outlined
      ></v-autocomplete>

      <v-text-field
        v-model="usuario.senha"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show ? 'text' : 'password'"
        @click:append="show = !show"
        label="Senha:"
        required
        :error-messages="error.senha"
        dense
        outlined
      ></v-text-field>

      <div class="mb-4">
        <v-btn small color="warning" outlined class="mr-4" @click="goHome">
          <v-icon dark> mdi-undo </v-icon>
          Voltar
        </v-btn>

        <v-btn
         small
          color="#07759e"
          class="mr-4 white--text"
          :loading="carregandoSave"
          @click="cadastrar_usuario_organizacao"
          dense
        >
          <v-icon dark> mdi-check </v-icon>
          Finalizar
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script>
import axios from "../../../axios/service_public.js";
export default {
  name: "cadastro-aluno",
  data: () => {
    return {
      title: "Cadastrar",
      dialog: false,
      show: false,
      carregandoSave: false,
      usuario: {
        id: null,
        nome: null,
        email: null,
        instituicao_id: null,
        senha: null,
      },
      error: {
        nome: null,
        email: null,
        instituicao_id: null,
        senha: null,
      },
      instituicoes: [],
    };
  },
  methods: {
    clear() {
      this.error = {};
      this.usuario = {};
    },
    goHome() {
      let redirect = setInterval(() => {
        this.$router.push({ path: "/" });
        this.$router.go();
        this.clear();
        this.carregandoSave = false;
        clearInterval(redirect);
      }, 1000);
    },
    carregar_instituicoes() {
      axios
        .get("/api/v1/instituicoes-all")
        .then((response) => {
          if (response.data.status) {
            this.instituicoes = response.data.instituicoes;
          }
        })
        .catch((error) => {
          console.log("[ERRO AO CARREGAR INSTITUICOES]: " + error);
        });
    },
    cadastrar_usuario_organizacao() {
      this.carregandoSave = true;

      let url = "/api/v1/novo-usuario";
      axios
        .post(url, {
          nome: this.usuario.nome,
          senha: this.usuario.senha,
          email: this.usuario.email,
          grupo_id: 1,
          tipo_usuario: "Alunos",
          instituicao_id: this.usuario.instituicao_id,
        })

        .then((response) => {
          if (response.data.status) {
            this.$toast.open({
              message: response.data.message,
              type: "success",
            });
          }
          let redirect = setInterval(() => {
            this.$router.push({ path: "/" });
            this.$router.go();
            this.clear();
            this.carregandoSave = false;
            clearInterval(redirect);
          }, 1000);
        })

        .catch((res) => {
          if (res.response.data && res.response.data.validation) {
            this.error = res.response.data.validation;

            this.$toast.open({
              message: res.response.data.message,
              type: "error",
            });
          } else {
            this.$toast.open({
              message: res.response.data.message,
              type: "error",
            });
          }
          this.carregandoSave = false;
        });
    },
  },
  mounted() {
    this.carregar_instituicoes();
  },
};
</script>

<style>
.form {
  max-width: 400px;
  min-width: 400px;
}
</style>