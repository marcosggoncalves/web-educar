<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <v-btn
            v-if="avaliadoresEnviar.length < 3"
            class="mr-5"
            fab
            dark
            small
            color="#07759e"
            @click="criarNovoCampoAvaliador()"
          >
            <v-icon dark> mdi-plus </v-icon>
          </v-btn>
          {{
            avaliadoresEnviar.length < 3
              ? "Adicionar novo avaliador"
              : "Avaliadores selecionados"
          }}
        </v-card-title>
        <div class="pa-10 container">
          <b>Titulo do projeto</b>: {{ trabalho.titulo }}
          <br />
          <b>Últimos Avaliadores</b>:
          {{
            trabalho && trabalho.avaliadores_ != ""
              ? trabalho.avaliadores_
              : "trabalho não foi encaminhado para nenhum avaliador."
          }}
        </div>
        <v-form class="ml-10 mr-10 pb-8 pt-5">
          <v-row
            class="border"
            dense
            v-for="(item, index) in avaliadoresEnviar"
            :key="index"
          >
            <v-col cols="12" md="12">
              <v-autocomplete
                :items="avaliadores"
                label="Selecionar avaliador"
                v-model="avaliadoresEnviar[index].avaliador_id"
                item-value="id"
                item-text="nome"
                auto-select-first
                chips
                clearable
                dense
                deletable-chips
              ></v-autocomplete>
            </v-col>

            <v-col>
              <v-btn
                class="mr-5"
                fab
                dark
                small
                color="red"
                @click="removerCampoAvaliador(index)"
              >
                <v-icon dark> mdi-close </v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row dense class="mt-5" v-if="avaliadoresEnviar.length > 0">
            <v-col cols="12" md="12">
              <v-btn
                tile
                class="button-cadastro"
                color="#07759e"
                @click="() => encaminharParaAvaliacao()"
                :loading="carregamento"
              >
                <v-icon left> mdi-send </v-icon>
                Enviar Projeto
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>

    <v-card class="ma-1">
      <v-card-title class="titulo">
        Trabalhos submetidos sem encaminhamento.
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

    <found v-else-if="trabalhos.length === 0" />

    <v-row justify="center" class="mt-3" v-else>
      <v-expansion-panels popout>
        <v-expansion-panel v-for="(item, i) in trabalhos" :key="i">
          <v-expansion-panel-header
            >#{{ item.id }} - Trabalho submetido</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <p>
              <b>Titulo:</b>
              {{ item.titulo }}
            </p>
            <p>
              <b>Autores:</b>
              {{ item.autores_ }}
            </p>
            <div class="mt-4 mb-4">
              <ul>
                <li class="none-list">
                  <v-chip outlined label color="warning" class="white--text">
                    Últimos Avaliadores:
                    {{
                      item && item.avaliadores_ != ""
                        ? item.avaliadores_
                        : "trabalho não foi encaminhado para nenhum avaliador."
                    }}
                  </v-chip>
                </li>

                <li class="none-list">
                  <v-chip outlined label color="success">
                    Trabalho submetido em: {{ dateFormat(item.submetido_em) }}
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
                    @click="
                      () =>
                        abrirDocumento(
                          item && item.documento_url_reenvio != null
                            ? item.documento_url_reenvio
                            : item.documento_url
                        )
                    "
                  >
                    ABRIR DOCUMENTO ENVIADO PARA AVALIAÇÃO
                  </v-chip>
                </li>

                <li class="none-list">
                  <v-chip
                    label
                    color="error"
                    @click="() => modalEncaminharAvaliador(item)"
                  >
                    ENCAMINHAR TRABALHO PARA AVALIAÇÃO
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
import Swal from "sweetalert2";

var moment = require("moment");
moment.locale("pt-br");

export default {
  name: "trabalhos",
  data: () => {
    return {
      dialog: false,
      trabalho: {},
      carregamento: false,
      trabalhos: [],
      avaliadores: [],
      avaliadoresEnviar: [],
      pagination: {
        page: 1,
        perPage: 1,
        lastPage: 1,
      },
    };
  },
  methods: {
    modalEncaminharAvaliador(trabalho) {
      this.trabalho = trabalho;
      this.avaliadoresEnviar = [];
      this.dialog = !this.dialog;
      this.loadAvaliadores();
    },
    criarNovoCampoAvaliador() {
      let usuario = JSON.parse(localStorage.getItem("user"));

      this.avaliadoresEnviar.push({
        avaliador_id: null,
        encaminhado_por: usuario.id,
        trabalho_id: this.trabalho.id,
      });
    },
    removerCampoAvaliador(index) {
      this.avaliadoresEnviar.splice(index, 1);
    },
    dateFormat(param) {
      return moment(param).format("DD/MM/YYYY HH:mm");
    },
    abrirDocumento(url) {
      window.open(`${global}${url}`, "_blank");
    },
    async loadAvaliadores() {
      const avaliadores = await axios.get(`/api/v1/coordenacao-avaliadores`);

      if (avaliadores && avaliadores.data.status) {
        this.avaliadores = avaliadores.data.avaliadores;
      }
    },
    encaminharParaAvaliacao() {
      Swal.fire({
        title: `Enviar o trabalho`,
        text: `Deseja realmente enviar o trabalho para avaliação?`,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#07759e",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: `Sim, pode enviar`,
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          axios
            .post(`/api/v1/encaminhar-trabalho/avaliador`, {
              avaliadores: this.avaliadoresEnviar,
              trabalho_id: this.trabalho.id,
            })
            .then((responseSubmterArquivo) => {
              Swal.fire({
                icon: "success",
                title: "Concluido!",
                confirmButtonColor: "#07759e",
                confirmButtonText: `Certo.`,
                text: responseSubmterArquivo.data.message,
              });

              this.avaliadoresEnviar = [];
              this.dialog = false;
              this.trabalho = {};
              this.loadTrabalhos();
            })
            .catch((res) => {
              this.$toast.open({
                message: res.response.data.message,
                type: "error",
              });
              this.carregamento = false;
            });
        }
      });
    },
    async loadTrabalhos(params = 1) {
      this.carregamento = true;

      const trabalhos = await axios.get(`/api/v1/coordenacao-trabalhos`, {
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