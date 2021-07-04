
<template>
  <div>
    <v-dialog v-model="GrupoAcesso" max-width="700px">
      <v-card>
        <v-card-title><b>Permissões</b></v-card-title>
        <v-divider></v-divider>
        <v-form ref="form" class="pa-5 mx-auto">
          <center v-if="carregamentosGruposCriados" class="mt-2">
            <v-progress-circular
              :size="40"
              class="ma-2"
              color="#07759e"
              indeterminate
            ></v-progress-circular>
          </center>

          <v-row v-else>
            <v-col cols="12" md="12">
              <v-autocomplete
                :items="grupos"
                label="Grupo de acesso:"
                readonly
                v-model="grupoAcessoPermissao.grupo_acesso_id"
                item-value="id"
                item-text="nome"
                auto-select-first
                chips
                clearable
                dense
                deletable-chips
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="12">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  v-for="item in permissoesGrupos"
                  :key="item.id"
                >
                  <div>
                    <span v-if="item.is_menu"
                      ><v-icon>{{ item.icon }}</v-icon
                      ><b> Menu:</b></span
                    >
                    <v-switch
                      dense
                      v-model="item.is_selecionado"
                      :label="item.nome"
                      color="#07759e"
                      :value="item.is_selecionado"
                      hide-details
                      @change="
                        (value) =>
                          habilitarDesabilitarPermissao(
                            value,
                            item.id_grupo_permissao
                          )
                      "
                    ></v-switch>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-btn color="error" class="mr-4 mt-6" @click="clearAddGrupo">
            <v-icon dark> mdi-close </v-icon>
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title><b>Novo Grupo</b></v-card-title>
        <v-divider></v-divider>
        <v-form ref="form" class="pa-8 mx-auto">
          <v-text-field
            color="#07759e"
            v-model="grupo.nome"
            :error-messages="error.nome"
            label="Nome Grupo:"
            required
          ></v-text-field>

          <v-btn color="error" class="mr-4 mt-6" @click="clear">
            <v-icon dark> mdi-close </v-icon>
          </v-btn>

          <v-btn
            color="#07759e"
            outlined
            class="mr-4 mt-6"
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
        class="p=ma-10"
        color="#07759e"
        indeterminate
      ></v-progress-circular>
    </center>
    <v-card v-else>
      <v-card-title>
        Grupos de Acesso
        <v-spacer></v-spacer>
        <v-btn color="#07759e" class="white--text" @click="clear">
          <v-icon dark> mdi-plus </v-icon>
          Novo Grupo
        </v-btn>
      </v-card-title>
      <found v-if="grupos.length === 0" />

      <v-simple-table v-else>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">Nome</th>
              <th class="text-left">Criado em</th>
              <th class="text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in grupos" :key="index">
              <td class="text-left">{{ item.id }}</td>
              <td class="text-left">{{ item.nome }}</td>
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
                      <v-list-item-title>Alterar informações</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="excluir(item.id)">
                      <v-list-item-title
                        >Excluir grupo de acesso</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item @click="modalCriarGrupo(item)">
                      <v-list-item-title>Permissões Grupo</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <div class="text-left mt-5">
      <v-pagination
        v-model="pagination.page"
        :length="pagination.lastPage"
        :total-visible="pagination.perPage"
        color="#07759e"
        v-if="grupos.length > 0"
        @input="(page) => loadGruposPermissoes(page)"
        @next="() => loadGruposPermissoes(pagination.page)"
        @previous="() => loadGruposPermissoes(pagination.page)"
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
      carregamentosGruposCriados: false,
      GrupoAcessoCriados: false,
      GrupoAcesso: false,
      grupo: {
        nome: null,
      },
      pagination: {
        page: 1,
        perPage: 1,
        lastPage: 1,
      },
      grupoAcessoPermissao: {
        grupo_acesso_id: null,
        permissao_id: null,
      },
      error: {
        nome: null,
      },
      grupos: [],
      permissoesGrupos: [],
    };
  },
  methods: {
    excluir(id) {
      Swal.fire({
        title: `Grupo será excluido`,
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
          let res = await axios.delete(`/api/v1/excluir-grupo/${id}`);

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
    clearAddGrupo() {
      this.grupoAcessoPermissao = {};
      this.GrupoAcesso = !this.GrupoAcesso;
    },
    modalCriarGrupo(item) {
      this.GrupoAcesso = !this.GrupoAcesso;
      this.grupoAcessoPermissao.grupo_acesso_id = item.id;

      // Carregar permissoes
      this.grupoPermissao(item.id);
    },
    editar(item) {
      this.dialog = !this.dialog;
      this.grupo = item;
    },
    clear() {
      this.grupo = {
        nome: null,
      };

      this.error = {
        nome: null,
      };

      this.dialog = !this.dialog;
    },
    salvar() {
      this.carregandoSave = true;

      let url = this.grupo.id
        ? `/api/v1/alterar-grupo/${this.grupo.id}`
        : "/api/v1/novo-grupo";

      axios
        .post(url, this.grupo)
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
    async habilitarDesabilitarPermissao(value, id) {
      const habilitarDesabilitar = await axios.get(
        `/api/v1/grupo-permissoes/alterar/${id}/${value === null ? 0 : 1}`
      );

      if (!habilitarDesabilitar.data.status) {
        this.$toast.open({
          message: "Não foi possivel modificar grupo de permissão!",
          type: "error",
        });
      }
    },
    async loadGruposPermissoes(params = 1) {
      this.carregamento = true;

      const grupos = await axios.get("api/v1/grupos", {
        params: {
          page: params,
        },
      });

      if (grupos.data.status) {
        this.grupos = grupos.data.grupos.data;

        this.pagination = {
          page: grupos.data.grupos.page,
          perPage: grupos.data.grupos.perPage,
          lastPage: grupos.data.grupos.lastPage,
          total: grupos.data.grupos.total,
        };

        this.carregamento = false;
      }
    },
    async grupoPermissao(id) {
      this.carregamentosGruposCriados = true;
      const permissoes = await axios.get(`/api/v1/grupo-permissoes/${id}`);

      if (permissoes.data.status) {
        this.permissoesGrupos = permissoes.data.permissoes;
        this.carregamentosGruposCriados = false;
      }
    },
    setup() {
      this.loadGruposPermissoes();
      this.$store.dispatch("verifyToken");
    },
  },
  mounted() {
    this.setup();
  },
};
</script>