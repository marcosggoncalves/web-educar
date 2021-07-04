<template>
  <div class="pa-1">
    <v-dialog
      v-model="dialogModalAvaliar"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-toolbar dark color="#07759e">
          <v-btn icon dark @click="() => openModal({})">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Avaliar trabalho </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-row dense class="pa-5">
          <v-col cols="12" md="6">
            <div class="container mb-4">
              <v-card-subtitle
                ><b>Titulo:</b> {{ trabalho.titulo }}</v-card-subtitle
              >
              <v-chip outlined small color="#07759e" class="ml-2 mt-3">
                Status atual: {{ trabalho.ultimo_status }}
              </v-chip>
            </div>

            <div>
              <v-form>
                <v-row dense>
                  <v-col cols="12" md="12">
                    <v-autocomplete
                      :items="status"
                      label="Selecionar status do trabalho:"
                      v-model="avaliar.status"
                      item-value="id"
                      item-text="nome"
                      required
                      :error-messages="error.status"
                      auto-select-first
                      chips
                      clearable
                      dense
                      deletable-chips
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="12">
                    <div class="mb-4">
                      <label>
                        <b
                          >Descreva sua avaliação:
                          {{
                            error && error.justificativa != null
                              ? error.justificativa
                              : ""
                          }}</b
                        >
                      </label>
                    </div>
                    <vue-editor
                      class="editor"
                      v-model="avaliar.justificativa"
                    ></vue-editor>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-btn
                      class="mt-4 button-cadastro"
                      tile
                      color="#07759e"
                      :loading="carregandoSave"
                      @click="() => avaliarProjeto(trabalho.id)"
                    >
                      <v-icon> mdi-send </v-icon>
                      Enviar avaliação
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <iframe
              :src="globalUrl + trabalho.documento_avaliador_url"
            ></iframe>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-card class="ma-1">
      <v-card-title class="titulo"> Trabalhos para avalições </v-card-title>
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
            >Titulo: {{ item.titulo }}</v-expansion-panel-header
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
                    <v-chip outlined small color="#07759e" class="mt-2">
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
                    <v-chip
                      class="mt-2"
                      @click="() => openModal(item)"
                      color="error"
                    >
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
    <div class="text-left mt-5">
      <v-pagination
        v-model="pagination.page"
        :length="pagination.lastPage"
        :total-visible="pagination.perPage"
        color="#07759e"
        @input="(page) => loadTrabalhos(page)"
        v-if="avaliacoes.length > 0"
        @next="() => loadTrabalhos(pagination.page)"
        @previous="() => loadTrabalhos(pagination.page)"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import axios from "../../../axios/service.js";
import global from "../../../globais.js";
import { VueEditor } from "vue2-editor";
import Swal from "sweetalert2";

var moment = require("moment");
moment.locale("pt-br");

export default {
  name: "avaliador",
  components: {
    VueEditor,
  },
  data: () => {
    return {
      avaliacoes: [],
      pagination: {
        page: 1,
        perPage: 1,
        lastPage: 1,
      },
      carregamento: false,
      dialogModalAvaliar: false,
      carregandoSave: false,
      globalUrl: global,
      trabalho: {},
      avaliar: {
        status: null,
        justificativa: null,
      },
      error: {
        status: null,
        justificativa: null,
      },
      status: [
        {
          id: 1,
          nome: "Devolvido para correção",
        },
        {
          id: 2,
          nome: "Aprovado",
        },
        {
          id: 3,
          nome: "Reprovado",
        },
      ],
    };
  },
  methods: {
    openModal(trabalho) {
      this.trabalho = trabalho;

      this.avaliar = {
        status: null,
        justificativa: null,
      };
      this.error = {
        status: null,
        justificativa: null,
      };
      this.dialogModalAvaliar = !this.dialogModalAvaliar;
    },
    dateFormat(param) {
      return moment(param).format("DD/MM/YYYY HH:mm");
    },
    abrirDocumento(url) {
      window.open(`${global}${url}`, "_blank");
    },
    avaliarProjeto(id) {
      this.carregandoSave = true;

      axios
        .post(`/api/v1/avaliar/${id}`, this.avaliar)
        .then((result) => {

          if (result.data.status) {
            Swal.fire({
              icon: "success",
              title: "Concluido!",
              confirmButtonColor: "#07759e",
              confirmButtonText: `Certo.`,
              text: result.data.message,
            });
          }

          this.carregandoSave = !this.carregandoSave;
          this.openModal({});
          this.loadTrabalhos();
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
    async loadTrabalhos(params = 1) {
      this.carregamento = true;
      let usuario = JSON.parse(localStorage.getItem("user"));

      const avaliacoes = await axios.get(
        `/api/v1/avaliador-trabalhos/${usuario.id}`,
        {
          params: {
            page: params,
          },
        }
      );

      if (avaliacoes && avaliacoes.data.status) {
        this.avaliacoes = avaliacoes.data.trabalhos.data;

        this.pagination = {
          page: avaliacoes.data.trabalhos.page,
          perPage: avaliacoes.data.trabalhos.perPage,
          lastPage: avaliacoes.data.trabalhos.lastPage,
          total: avaliacoes.data.trabalhos.total,
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
.container {
  margin-top: 1rem;
  border: 1px solid rgb(206, 206, 206);
  background: #f8f8f8;
  padding: 20px 20px;
}
iframe {
  width: 100%;
  height: 100%;
}
.titulo {
  border-left: 8px solid #07759e;
  padding: 15px 15px;
}
</style>