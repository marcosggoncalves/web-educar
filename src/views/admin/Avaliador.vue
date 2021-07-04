<template>
  <div class="pa-1">
    <v-card class="ma-1">
      <v-card-title>Trabalhos para avalições</v-card-title>
    </v-card>

    <center v-if="carregamento" class="mt-5">
      <v-progress-circular
        :size="40"
        class="margin"
        color="#00a65a"
        indeterminate
      ></v-progress-circular>
    </center>

    <v-row justify="center" class="mt-3" v-else>
      <v-expansion-panels popout>
        <v-expansion-panel v-for="(item, i) in avaliacoes" :key="i">
          <v-expansion-panel-header
            ><b>Titulo: {{ item.titulo }}</b></v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-row dense class="mb-2">
              <div>
                <ul>
                  <li>Enviado pelo coordenador: {{ item.coordenador_ }}</li>
                  <li class="none-list">
                    <v-chip outlined small color="#07759e" class="mt-2">
                      Trabalho enviado em: {{ dateFormat(item.enviado_em) }}
                    </v-chip>
                  </li>

                  <li class="none-list">
                    <v-chip outlined small color="#00a65a" class="mt-2">
                      Status: {{ item.ultimo_status }}
                    </v-chip>
                  </li>

                  <li class="none-list">
                    <v-chip
                      
                      class="mt-2"
                      @click="abrirDocumento(item.documento_avaliador_url)"
                    >
                      ABRIR DOCUMENTO ENVIADO
                    </v-chip>
                  </li>
                  <li class="none-list">
                    <v-chip class="mt-2" color="error">
                      INICIAR AVALIAÇÃO
                    </v-chip>
                  </li>
                </ul>
              </div>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script>
import axios from "../../../axios/service.js";
import global from "../../../globais.js";

var moment = require("moment");
moment.locale("pt-br");

export default {
  name: "avaliador",

  data: () => {
    return {
      avaliacoes: [],
      carregamento: false,
    };
  },
  methods: {
    dateFormat(param) {
      return moment(param).format("DD/MM/YYYY HH:mm");
    },
    abrirDocumento(url) {
      window.open(`${global}${url}`, "_blank");
    },
    async loadTrabalhos() {
      this.carregamento = true;
      let usuario = JSON.parse(localStorage.getItem("user"));

      const avaliacoes = await axios.get(
        `/api/v1/avaliador-trabalhos/${usuario.id}`
      );

      if (avaliacoes && avaliacoes.data.status) {
        this.avaliacoes = avaliacoes.data.trabalhos.data;
        this.carregamento = false;
      }
    },
  },
  mounted() {
    this.loadTrabalhos();
  },
};
</script>


<style scoped>
.none-list {
  list-style: none;
}
.container {
  margin-top: 1rem;
  border: 1px solid rgb(206, 206, 206);
  background: #f8f8f8;
  padding: 20px 20px;
}
</style>