<template>
  <div>
    <v-card class="ma-1">
      <v-card-title class="titulo">
        ({{ avaliacoes.length }}) - Avaliações encaminhadas
      </v-card-title>
    </v-card>

    <center v-if="carregamento" class="mt-5">
      <v-progress-circular
        :size="40"
        class="margin"
        color="#07759e"
        indeterminate
      ></v-progress-circular>
    </center>

    <found v-else-if="avaliacoes.length === 0" />

    <v-row justify="center" class="mt-3" v-else>
      <v-expansion-panels popout>
        <v-expansion-panel v-for="(item, i) in avaliacoes" :key="i">
          <v-expansion-panel-header
            >#{{ item.id }} - Avaliação enviada em
            {{
              dateFormat(item.avaliacao_iniciada_em)
            }}</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-row dense>
              <v-col cols="12" md="12">
                <label><b>Titulo:</b></label>
                <div class="justificativa">
                  <p v-html="item.titulo"></p>
                </div>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" md="12">
                <label><b>Autores:</b></label>
                <div class="justificativa">
                  <p v-html="item.autores_"></p>
                </div>
              </v-col>
            </v-row>
            <v-row dense v-if="item.justificativa != null">
              <v-col cols="12" md="12">
                <label><b>Avaliação:</b></label>
                <div class="justificativa">
                  <p v-html="item.justificativa"></p>
                </div>
              </v-col>
            </v-row>
            <div class="mt-4 mb-4">
              <ul>
                <li class="none-list">
                  <v-chip label class="white--text" color="#07759e">
                    Status: {{ item.ultimo_status }}
                  </v-chip>
                </li>

                <li class="none-list">
                  <v-chip label color="error">
                    Avaliador : {{ item.avaliador_ }}
                  </v-chip>
                </li>

                <li class="none-list">
                  <v-chip label color="warning">
                    Trabalho submetido em: {{ dateFormat(item.created_at) }}
                  </v-chip>
                </li>

                <li class="none-list">
                  <v-chip
                    label
                    v-if="item && item.documento_url != null"
                    @click="() => abrirDocumento(item.documento_url)"
                  >
                    ABRIR DOCUMENTO ENVIADO NA AVALIAÇÃO 1
                  </v-chip>
                </li>

                <li class="none-list">
                  <v-chip
                    label
                    v-if="item && item.documento_url_reenvio != null"
                    @click="() => abrirDocumento(item.documento_url_reenvio)"
                  >
                    ABRIR DOCUMENTO ENVIADO NA AVALIAÇÃO 2
                  </v-chip>
                </li>
              </ul>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <div class="text-left mt-5">
      <v-pagination
        v-model="pagination.page"
        :length="pagination.lastPage"
        :total-visible="pagination.perPage"
        color="#07759e"
        @input="(page) => loadavaliacoes(page)"
        v-if="avaliacoes.length > 0"
        @next="() => loadavaliacoes(pagination.page)"
        @previous="() => loadavaliacoes(pagination.page)"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import axios from "../../../axios/service.js";
import global from "../../../globais.js";

var moment = require("moment");
moment.locale("pt-br");

export default {
  name: "avaliacoes",
  data: () => {
    return {
      carregamento: false,
      avaliacoes: [],
      pagination: {
        page: 1,
        perPage: 1,
        lastPage: 1,
      },
    };
  },
  methods: {
    dateFormat(param) {
      return moment(param).format("DD/MM/YYYY HH:mm");
    },
    abrirDocumento(url) {
      window.open(`${global}${url}`, "_blank");
    },
    async loadAvaliacoes(params = 1) {
      this.carregamento = true;

      const avaliacoes = await axios.get(`/api/v1/avaliacoes-realizadas`, {
        params: {
          page: params,
        },
      });

      if (avaliacoes && avaliacoes.data.status) {
        this.avaliacoes = avaliacoes.data.avaliacoes.data;

        this.pagination = {
          page: avaliacoes.data.avaliacoes.page,
          perPage: avaliacoes.data.avaliacoes.perPage,
          lastPage: avaliacoes.data.avaliacoes.lastPage,
          total: avaliacoes.data.avaliacoes.total,
        };
        this.carregamento = false;
      }
    },
  },
  mounted() {
    this.loadAvaliacoes();
    this.$store.dispatch("verifyToken");
  },
};
</script>


<style scoped>
.none-list {
  list-style: none;
}
.titulo {
  border-left: 8px solid #07759e;
  padding: 15px 15px;
}
.container {
  margin-top: 1rem;
  border: 1px solid rgb(206, 206, 206);
  background: #f8f8f8;
  padding: 20px 20px;
}
ul {
  display: flex;
  flex-direction: column;
}

li {
  padding-right: 10px;
  margin-bottom: 8px;
}

.v-application ul,
.v-application ol {
  padding-left: unset;
}

.justificativa {
  border: 1px solid rgb(206, 206, 206);
  background: #f8f8f8;
  padding: 20px 20px;

  margin-bottom: 10px;
  margin-top: 10px;
  text-align: justify;
}
</style>