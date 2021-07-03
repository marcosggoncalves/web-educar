<template>
  <v-row dense>
    <v-dialog v-model="dialogModalRevisaoDisponivel" width="900">
      <v-card class="pa-5">
        <div class="border">
          <h1 class="text-h5">Histórico de arquivo:</h1>
          <v-row dense>
            <v-col cols="12" md="12">
              <v-chip
                color="#07759e"
                outlined
                label
                class="mr-2 mt-4 mb-2"
                @click="abrirDocumento(projeto_selecionado.documento_url)"
              >
                Baixar arquivo enviado para avaliação 1
              </v-chip>

              <v-chip
                color="#07759e"
                class="mr-2 mt-4 mb-2"
                 outlined
                label
                v-if="
                  projeto_selecionado &&
                  projeto_selecionado.documento_url_reenvio != null
                "
                @click="
                  abrirDocumento(projeto_selecionado.documento_url_reenvio)
                "
              >
                Baixar arquivo enviado para avaliação 2
              </v-chip>
            </v-col>
          </v-row>

          <div
            class="mt-6"
            v-if="
              projeto_selecionado.ultimo_status === 'Devolvido para correção' &&
              projeto_selecionado.avaliacoes < 2
            "
          >
            <span class="text-h5 mb-2">Enviar nova versão:</span>

            <div class="mt-1">
              <v-form>
                <v-row dense>
                  <v-col cols="12" md="10">
                    <v-file-input
                      v-model="fileReenvio"
                      accept="application/pdf"
                      placeholder="Faça upload da escrita do seu projeto"
                      label="Upload odo arquivo .PDF"
                      prepend-icon="mdi-paperclip"
                    >
                      <template v-slot:selection="{ text }">
                        <v-chip small label color="#00a65a">
                          {{ text }}
                        </v-chip>
                      </template>
                    </v-file-input>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-btn
                      class="button-cadastro"
                      color="#00a65a"
                      fab
                      dark
                      small
                      :loading="carregandoSave"
                      @click="
                        () => submetidoTrabalhoReenvio(projeto_selecionado.id)
                      "
                    >
                      <v-icon> mdi-send </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </div>
        </div>

        <div
          v-for="(item, index) in projeto_selecionado.avaliacoes"
          :key="index"
        >
          <p class="text-h5">Avaliação #{{ item.id }}</p>
          <v-row dense class="mb-2">
            <v-col cols="12" md="3">
              <v-chip small color="#07759e" class="mb-2 white--text">
                Avaliado em: {{ dateFormat(item.updated_at) }}
              </v-chip>
            </v-col>

            <v-col cols="12" md="3">
              <v-chip small color="#00a65a" class="ml-2 mb-2 white--text">
                Status: {{ item.ultimo_status }}
              </v-chip>
            </v-col>

            <v-col cols="12" md="3">
              <v-chip
                small
                class="ml-2 mb-2"
                @click="abrirDocumento(item.documento_avaliador_url)"
              >
                Abrir documento enviado
              </v-chip></v-col
            >
          </v-row>
          <v-row dense v-if="item.justificativa != null">
            <v-col cols="12" md="12">
              <label><b>Visão avaliador:</b></label>
              <div class="justificativa">
                {{ item.justificativa }}
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
    <v-col cols="12" md="6">
      <v-card>
        <div>
          <v-card-title>
            <v-btn
              class="mr-5"
              fab
              dark
              small
              color="#07759e"
              @click="criarNovoCampoAutor()"
            >
              <v-icon dark> mdi-plus </v-icon>
            </v-btn>

            Adicionar novo autor
          </v-card-title>

          <v-form class="pa-5">
            <v-row
              class="border"
              dense
              v-for="(item, index) in projeto.autores"
              :key="index"
            >
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="projeto.autores[index].nome"
                  label="Nome:"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="projeto.autores[index].email"
                  label="Email:"
                  required
                ></v-text-field>
              </v-col>

              <v-col
                v-if="
                  index > 0 && projeto.autores && projeto.autores.length > 1
                "
              >
                <v-btn
                  class="mr-5"
                  fab
                  dark
                  small
                  color="red"
                  @click="removerCampoAutor(index)"
                >
                  <v-icon dark> mdi-close </v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="projeto.titulo"
                  outlined
                  label="Titulo do trabalho"
                  :error-messages="error.titulo"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-alert
                  border="left"
                  colored-border
                  type="error"
                  elevation="2"
                >
                  Para enviar o documento do seu projeto, salve como <b>.PDF</b>
                </v-alert>
              </v-col>
              <v-col cols="12" md="12">
                <v-file-input
                  v-model="file"
                  accept="application/pdf"
                  placeholder="Faça upload da escrita do seu projeto"
                  label="Upload odo arquivo .PDF"
                  prepend-icon="mdi-paperclip"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip small label color="#00a65a">
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" md="12">
                <v-btn
                  tile
                  class="button-cadastro"
                  color="#00a65a"
                  :disabled="!projeto.titulo && projeto.autores.length > 0"
                  :loading="carregandoSave"
                  @click="() => submterProjeto()"
                >
                  <v-icon left> mdi-send </v-icon>
                  Enviar Projeto
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <center v-if="loadTrabalho">
        <v-progress-circular
          :size="40"
          class="margin"
          color="#00a65a"
          indeterminate
        ></v-progress-circular>
      </center>
      <div v-else>
        <div v-if="trabalhos.length === 0">
          <div class="pa-5">
            <v-alert border="left" colored-border type="warning" elevation="1">
              Nenhum projeto encontrado!
            </v-alert>
          </div>
        </div>
        <v-card v-else>
          <v-card-title>Meus projetos</v-card-title>
          <div class="pa-5">
            <v-list-item
              dense
              v-for="(item, index) in trabalhos"
              :key="index"
              class="borderBottom"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <b>Projeto: {{ item.titulo }} </b>
                </v-list-item-title>

                <v-list-item-title>
                  <b>Autores: {{ item.autores }} </b>
                </v-list-item-title>

                <v-list-item-subtitle>
                  <v-chip
                    v-if="
                      item.ultimo_status != 'Submetido' &&
                      item.ultimo_status != 'Aguardando documento' &&
                      item.ultimo_status != 'Aguardando Avaliação'
                    "
                    small
                    color="#07759e"
                    class="mr-2 mt-4 mb-2 white--text"
                    @click="openModalRevisao(item)"
                  >
                    Revisão disponivel
                  </v-chip>

                  <v-chip small color="#00a65a" class="mt-4 mb-2 white--text">
                    {{ item.ultimo_status }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import axios from "../../../axios/service.js";
import global from "../../../globais.js";

var moment = require("moment");
moment.locale("pt-br");

export default {
  data: () => {
    return {
      dialogModalRevisaoDisponivel: false,
      trabalhos: [],
      file: null,
      fileReenvio: null,
      projeto_selecionado: {},
      projeto: {
        titulo: null,
        autores: [
          {
            nome: "",
            email: "",
          },
        ],
      },
      error: {},
      carregandoSave: false,
      loadTrabalho: false,
    };
  },
  methods: {
    openModalRevisao(item) {
      this.projeto_selecionado = item;
      this.dialogModalRevisaoDisponivel = !this.dialogModalRevisaoDisponivel;
    },
    criarNovoCampoAutor() {
      this.projeto.autores.push({
        nome: "",
        email: "",
      });
    },
    removerCampoAutor(index) {
      this.projeto.autores.splice(index, 1);
    },
    dateFormat(param) {
      return moment(param).format("DD/MM/YYYY HH:mm");
    },
    submterProjeto() {
      this.carregandoSave = true;
      axios
        .post("/api/v1/submeter-trabalho", this.projeto)
        .then((result) => {
          let documento = new FormData();

          documento.append("documento", this.file);

          axios
            .post(
              `/api/v1/submeter-arquivo?trabalho=${result.data.trabalho.id}&titulo=${result.data.trabalho.titulo}`,
              documento,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((responseSubmterArquivo) => {
              this.$toast.open({
                message: responseSubmterArquivo.data.message,
                type: "success",
              });

              this.carregandoSave = false;
              this.projeto = {
                titulo: null,
                autores: [
                  {
                    nome: "",
                    email: "",
                  },
                ],
              };
              this.error = {};
              this.file = null;
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
    async submetidoTrabalhoReenvio(id) {
      if (!id) {
        this.$toast.open({
          message: "Identificação do projeto não localizada!",
          type: "error",
        });
      }
      let documento = new FormData();

      documento.append("documento", this.fileReenvio);

      axios
        .post(`/api/v1/submeter-arquivo-reenvio/${id}`, documento, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((responseSubmterArquivo) => {
          this.$toast.open({
            message: responseSubmterArquivo.data.message,
            type: "success",
          });

          this.carregandoSave = false;
          this.dialogModalRevisaoDisponivel = false;
          this.projeto_selecionado = {};
          this.fileReenvio = null;
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
    async loadTrabalhos() {
      this.loadTrabalho = true;
      let usuario = JSON.parse(localStorage.getItem("user"));

      const trabalhos = await axios.get(
        `/api/v1/meus-trabalhos-submetidos/${usuario.id}`
      );

      if (trabalhos && trabalhos.data.status) {
        this.trabalhos = trabalhos.data.trabalhos;
        this.loadTrabalho = false;
      }
    },
    abrirDocumento(url) {
      window.open(`${global}${url}`, "_blank");
    },
  },
  mounted() {
    this.loadTrabalhos();
  },
};
</script>

<style scoped>
.border {
  border: 1px solid rgb(206, 206, 206);
  padding: 20px 20px;
  background: #f8f8f8;
  margin-bottom: 20px;
}
.borderBottom {
  border: 1px solid rgb(206, 206, 206);
  margin-bottom: 20px;
}
.margin {
  margin: 20px 20px;
}
.marginLeft {
  margin-left: 80px;
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