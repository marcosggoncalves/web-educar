<template>
  <div class="cadastro-cidade">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <b>Cadastrar cidade</b>
        </v-card-title>
        <v-divider></v-divider>

        <v-form ref="form" class="pa-8 mx-auto">
          <v-text-field
            v-model="cidade.nome"
            label="Nome:"
            required
            :error-messages="error.nome"
          ></v-text-field>

          <v-text-field
            v-model="cidade.uf"
            label="UF:"
            required
            :error-messages="error.uf"
          ></v-text-field>

          <v-btn color="error" class="mr-4 mt-6" @click="modal">
            <v-icon dark> mdi-close </v-icon>
          </v-btn>

          <v-btn
            color="#046c34"
            outlined
            class="mr-4 mt-6"
            @click="cadastro_cidade"
            :loading="carregandoSave"
          >
            <v-icon dark> mdi-check </v-icon>
            Salvar
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>
    <v-row align="center" justify="space-between" class="linha-top">
      <h2>Cadastro de cidades</h2>

      <v-btn tile class="button-cadastro" color="#00a65a" @click="modal">
        <v-icon left> mdi-pencil </v-icon>

        Cadastrar cidade
      </v-btn>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="cidades"
      :items-per-page="8"
      class="elevation-1"
    >
    </v-data-table>
  </div>
</template>

<script>
import axios from "../../../axios/service.js";

export default {
  name: "cidades",

  data: () => {
    return {
      cidades: [],
      dialog: false,
      carregandoSave: false,
      cidade: {
        nome: "",
        uf: "",
      },
      error: {
        nome: "",
        uf: "",
      },
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Nome", value: "nome" },
        { text: "UF", value: "uf" },
        { text: "criado em", value: "created_at" },
      ],
    };
  },

  methods: {
    clear() {
      this.error = {};
      this.cidades = {};
    },
    modal() {
      this.clear();
      this.dialog = !this.dialog;
    },

    carregar_cidades() {
      axios
        .get("/api/v1/cidades")
        .then((response) => {
          if (response.data.status) {
            this.cidades = response.data.cidades.data;
          }
        })

        .catch(function (error) {
          console.log("[ERRO NA BUSCA DAS CIDADES]: " + error);
        });
    },

    cadastro_cidade() {
      axios
        .post("/api/v1/nova-cidade", {
          nome: this.cidade.nome,
          uf: this.cidade.uf,
        })
        .then((response) => {
          if (response.data.status) {
            this.$toast.open({
              message: response.data.message,
              type: "success",
            });

            this.carregandoSave = false;
            this.dialog = !this.dialog;
            this.carregar_cidades();
            this.clear();
          }
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
    this.carregar_cidades();
  },
};
</script>


<style>
.cadastro-cidade h2 {
  margin-top: 10px;
  margin-bottom: 20px;
}

.linha-top {
  width: 100%;
  margin: 0 auto;
}

.button-cadastro {
  color: rgba(255, 255, 255, 0.9) !important;
}
</style>