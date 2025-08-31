
<template>
  <div>
    <div>
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title
            ><b>Nova Permissão</b>
            <v-switch
              v-model="permissao.is_menu"
              label="Item Menu"
              class="pl-3 pt-1"
              color="#07759e"
            ></v-switch
          ></v-card-title>
          <v-divider></v-divider>
          <v-form ref="form" class="pa-3 mx-auto">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  color="#07759e"
                  v-model="permissao.nome"
                  :error-messages="error.nome"
                  label="Nome permissão:"
                  required
                   outlined
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  color="#07759e"
                  v-model="permissao.icon"
                  :error-messages="error.icon"
                  label="Selecione o icone:"
                  required
                   outlined
                      dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  color="#07759e"
                  v-model="permissao.rota_web"
                  :error-messages="error.rota_web"
                  label="Link da página:"
                  required
                   outlined
                      dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  color="#07759e"
                  v-model="permissao.rota_api"
                  :error-messages="error.rota_api"
                  label="Link da Api:"
                  required
                   outlined
                      dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn color="error" dense class="mr-4" @click="clear">
              <v-icon dark> mdi-close </v-icon>
            </v-btn>

            <v-btn
              color="#07759e"
              class="white--text"
              @click="salvar"
              dense
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

      <found v-else-if="permissoes.length === 0" />

      <v-card v-else elevation="0">
        <v-card-title>
          <b>Permissões</b>
          <v-spacer></v-spacer>
          <v-btn color="#07759e" class="white--text" @click="clear">
            <v-icon dark> mdi-plus </v-icon>
            Nova Permissão
          </v-btn>
        </v-card-title>

        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Nome</th>
                <th class="text-left">Icon</th>
                <th class="text-left">Menu</th>
                <th class="text-left">Página</th>
                <th class="text-left">Api</th>
                <th class="text-left">Criado em</th>
                <th class="text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in permissoes" :key="index">
                <td class="text-left">{{ item.id }}</td>
                <td class="text-left">{{ item.nome }}</td>
                <td class="text-left">
                  <v-icon>{{ item.icon }}</v-icon>
                </td>
                <td class="text-left">
                  <v-icon color="success" v-if="item.is_menu">
                    mdi-check
                  </v-icon>

                  <v-icon color="error" v-else> mdi-close </v-icon>
                </td>
                <td class="text-left">
                  {{ item.rota_web }}
                </td>
                <td class="text-left">
                  {{ item.rota_api }}
                </td>
                <td class="text-left">
                  {{ dateFormat(item.created_at) }}
                </td>
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
                        <v-list-item-title>Excluir permissão</v-list-item-title>
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
        v-if="permissoes.length > 0"
        @input="(page) => loadPermissoes(page)"
        @next="() => loadPermissoes(pagination.page)"
        @previous="() => loadPermissoes(pagination.page)"
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
      permissao: {
        nome: null,
        icon: null,
        rota_api: null,
        rota_web: null,
        is_menu: false,
      },
      error: {
        nome: null,
        icon: null,
        rota_api: null,
        rota_web: null,
        is_menu: false,
      },
      permissoes: [],
      grupos: [],
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
        title: `Permissão será excluido`,
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
          let res = await axios.delete(`/api/v1/excluir-permissao/ ${id}`);

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
      this.permissao = item;
    },
    clear() {
      this.permissao = {
        nome: null,
        icon: null,
        rota_api: null,
        rota_web: null,
      };

      this.error = {
        nome: null,
        icon: null,
        rota_api: null,
        rota_web: null,
      };

      this.dialog = !this.dialog;
    },
    salvar() {
      this.carregandoSave = true;

      let url = this.permissao.id
        ? `/api/v1/alterar-permissao/${this.permissao.id}`
        : "/api/v1/nova-permissao";

      axios
        .post(url, this.permissao)
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
    async loadPermissoes(params) {
      this.carregamento = true;

      const grupos = await axios.get("api/v1/permissoes", {
        params: {
          page: params,
        },
      });

      if (grupos.data.status) {
        this.permissoes = grupos.data.permissoes.data;

        this.pagination = {
          page: grupos.data.permissoes.page,
          perPage: grupos.data.permissoes.perPage,
          lastPage: grupos.data.permissoes.lastPage,
          total: grupos.data.permissoes.total,
        };

        this.carregamento = false;
      }
    },
    setup() {
      this.loadPermissoes(this.pagination.page);
      this.$store.dispatch("verifyToken");
    },
  },
  mounted() {
    this.setup();
  },
};
</script>