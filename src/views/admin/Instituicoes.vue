
<template>
  <div>
    <div>
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title><b>Nova instituição</b> </v-card-title>
          <v-divider></v-divider>
          <v-form ref="form" class="pa-3 mx-auto">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="instituicao.nome"
                  label="Nome:"
                  required
                     dense
                  outlined
                  :error-messages="error.nome"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="cidades"
                  label="Cidade"
                  v-model="instituicao.cidade_id"
                  item-value="id"
                  item-text="nome"
                  auto-select-first
                  chips
                  clearable
                  dense
                  outlined
                  deletable-chips
                  required
                  :error-messages="error.cidade_id"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-btn color="error" class="mr-4" @click="clear">
              <v-icon dark> mdi-close </v-icon>
            </v-btn>

            <v-btn
              color="#07759e"
              class="mr-4 white--text"
              @click="salvar"
              :disabled="carregamentoSave"
              :loading="carregamentoSave"
            >
              <v-icon dark> mdi-check </v-icon>
              Salvar
            </v-btn>
          </v-form>
        </v-card>
      </v-dialog>

      <center v-if="carregamento" class="mt-10">
        <v-progress-circular
          :size="40"
          class="ma-10"
          color="#07759e"
          indeterminate
        ></v-progress-circular>
      </center>

      <found v-else-if="instituicoes.length === 0" />

      <v-card elevation="0" v-else>
        <v-card-title>
          <b>Instituições</b>
          <v-spacer></v-spacer>
          <v-btn color="#07759e" class="white--text" @click="clear">
            <v-icon dark> mdi-plus </v-icon>
            Nova Instituição
          </v-btn>
        </v-card-title>

        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Nome</th>
                <th class="text-left">Criado em</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in instituicoes" :key="index">
                <td class="text-left">{{ item.id }}</td>
                <td class="text-left">{{ item.nome }}</td>
                <td class="text-left">{{ dateFormat(item.created_at) }}</td>
                <td class="text-left">
                  <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn dark icon v-bind="attrs" v-on="on" color="black">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item @click="editar(item)">
                        <v-list-item-title
                          >Alterar informações</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item @click="excluir(item.id)">
                        <v-list-item-title>Excluir</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </div>
    <div class="text-left mt-5">
      <v-pagination
        v-model="pagination.page"
        :length="pagination.lastPage"
        :total-visible="pagination.perPage"
        color="#07759e"
        v-if="instituicoes.length > 0"
        @input="(page) => loadInstituicao(page)"
        @next="() => loadInstituicao(pagination.page)"
        @previous="() => loadInstituicao(pagination.page)"
      ></v-pagination>
    </div>
  </div>
</template>
<script>
import axios from "../../../axios/service.js";
import Swal from "sweetalert2";

var moment = require("moment");
moment.locale("pt-br");

export default {
  data() {
    return {
      dialog: false,
      carregamento: false,
      carregamentoSave: false,
      instituicoes: [],
      instituicao: {
        nome: null,
      },
      error: {
        nome: null,
      },
      pagination: {
        page: 1,
        perPage: 1,
        lastPage: 1,
      },
    };
  },
  methods: {
    excluir(id) {
      Swal.fire({
        title: `Instituição será excluido`,
        text: `Deseja excluir registro?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#07759e",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: `Sim, pode continuar`,
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          let res = await axios.delete(`/api/v1/excluir-instituicao/${id}`);

          if (res.data.status) {
            Swal.fire({
              title: "Exclusão realizada!",
              text: res.data.message,
              icon: "success",
              confirmButtonColor: "#07759e",
            });
            this.setup();
          } else {
            Swal.fire({
              title: "Erro encontrado!",
              text: res.data.message,
              icon: "warning",
              confirmButtonColor: "#d33",
            });
          }
        }
      });
    },
    editar(item) {
      this.dialog = !this.dialog;
      this.instituicao = item;
    },
    clear() {
      this.instituicao = {};
      this.error = {};
      this.dialog = !this.dialog;
    },
    salvar() {
      this.carregandoSave = true;

      let url = this.instituicao.id
        ? `/api/v1/alterar-instituicao/${this.instituicao.id}`
        : "/api/v1/nova-instituicao";

      axios
        .post(url, this.instituicao)
        .then((res) => {
          if (res.data.status) {
            this.$toast.open({
              message: res.data.message,
              type: "success",
            });

            this.clear();
            this.setup();

            this.carregandoSave = false;
          } else {
            this.$toast.open({
              message: res.data.message,
              type: "error",
            });
            this.carregandoSave = false;
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
    dateFormat(param) {
      return moment(param).format("DD/MM/YYYY HH:mm");
    },
    async loadInstituicao(params) {
      this.carregamento = true;

      const instituicoes = await axios.get("api/v1/instituicoes", {
        params: {
          page: params,
        },
      });

      if (instituicoes.data.status) {
        this.instituicoes = instituicoes.data.instituicoes.data;

        this.pagination = {
          page: instituicoes.data.instituicoes.page,
          perPage: instituicoes.data.instituicoes.perPage,
          lastPage: instituicoes.data.instituicoes.lastPage,
          total: instituicoes.data.instituicoes.total,
        };

        this.carregamento = false;
      }
    },
    async loadCidades() {
      const cidades = await axios.get("/api/v1/cidades-all");

      if (cidades && cidades.data.cidades) {
        this.cidades = cidades.data.cidades;
      }
    },
    setup() {
      this.loadCidades();
      this.loadInstituicao(this.pagination.page);
      this.$store.dispatch("verifyToken");
    },
  },
  mounted() {
    this.setup();
  },
};
</script>