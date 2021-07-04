<template>
  <div>
    <v-card class="ma-1">
      <v-card-title class="titulo"> ({{trabalhos.length}}) - Trabalhos recebidos </v-card-title>
    </v-card>

    <center v-if="carregamento" class="mt-5">
      <v-progress-circular
        :size="40"
        class="margin"
        color="#07759e"
        indeterminate
      ></v-progress-circular>
    </center>

    <found v-else-if="trabalhos.length === 0" />

    <v-row justify="center" class="mt-3" v-else>
      <v-expansion-panels popout>
        <v-expansion-panel v-for="(item, i) in trabalhos" :key="i">
          <v-expansion-panel-header
            >#{{ item.id }} - Trabalho recebido em
            {{ dateFormat(item.created_at) }}</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <p>
              <b>Titulo:</b>
              {{ item.titulo }}
            </p>
            <div class="mt-4 mb-4">
              <ul>
                <li class="none-list">
                  <v-chip outlined label color="warning">
                    Enviado por : {{ item.enviado_por }}
                  </v-chip>
                </li>

                <li class="none-list">
                  <v-chip outlined label color="warning">
                    Trabalho submetido em: {{ dateFormat(item.created_at) }}
                  </v-chip>
                </li>

                <li class="none-list">
                  <v-chip label outlined color="#07759e">
                    Status: {{ item.ultimo_status }}
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
        @input="(page) => loadTrabalhos(page)"
        v-if="trabalhos.length > 0"
        @next="() => loadTrabalhos(pagination.page)"
        @previous="() => loadTrabalhos(pagination.page)"
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
  name: "trabalhos",
  data: () => {
    return {
      carregamento: false,
      trabalhos: [],
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
    async loadTrabalhos(params = 1) {
      this.carregamento = true;

      const trabalhos = await axios.get(`/api/v1/trabalhos-recebidos`, {
        params: {
          page: params,
        },
      });

      if (trabalhos && trabalhos.data.status) {
        this.trabalhos = trabalhos.data.trabalhos.data;

        this.pagination = {
          page: trabalhos.data.trabalhos.page,
          perPage: trabalhos.data.trabalhos.perPage,
          lastPage: trabalhos.data.trabalhos.lastPage,
          total: trabalhos.data.trabalhos.total,
        };

        this.carregamento = false;
      }
    },
  },
  mounted() {
    this.loadTrabalhos();
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
</style>