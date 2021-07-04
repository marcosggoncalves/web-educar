<template>
  <div class="cadastro-cidade">

    <!-- modal cadastro -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <b>{{title}} cidade</b>
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

    <!-- list select -->
    <v-simple-table class="elevation-3 mt-2x dense">
      <template v-slot:top>
        <v-row align="center" justify="space-between" class="linha-top">
          <h2>Cidades Cadastradas</h2>

          <v-btn tile class="button-cadastro" color="#07759e" @click="modal">
            <v-icon left> mdi-pencil </v-icon>

            Cadastrar cidade
          </v-btn>
        </v-row>
      </template>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Cidade</th>
            <th class="text-left">UF</th>
            <th class="text-left">Criado em</th>
            <th class="text-left">Ações</th>
          </tr>
        </thead>
        <tbody v-if="cidades.length > 0">
          <tr v-for="item in cidades" :key="item.id">
            <td class="text-left">{{ item.id }}</td>
            <td class="text-left">{{ item.nome }}</td>
            <td class="text-left">{{ item.uf }}</td>
            <td class="text-left">{{ item.created_at}}</td>
            <td class="text-left">
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn dark icon v-bind="attrs" v-on="on" color="black">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="excluir(item.id)">
                    <v-list-item-title>Excluir</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="editar(item)">
                    <v-list-item-title>Alterar</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import axios from "../../../axios/service.js";
import Swal from "sweetalert2";

export default {
  name: "cidades",

  data: () => {
    return {
      cidades: [],
      dialog: false,
      carregandoSave: false,
      title: 'Cadastrar',
      cidade: {
        id: '',
        nome: "",
        uf: "",
      },
      error: {
        nome: "",
        uf: "",
      },
    };
  },

  methods: {
    clear() {
      this.error = {};
      this.cidade = {};
    
    },

    modal() {
      this.title = 'Cadastrar'
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

      let url = this.cidade.id ? '/api/v1/alterar-cidade/' + this.cidade.id : '/api/v1/nova-cidade';
      axios
        .post(url, {
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

    editar(item){
      this.title = 'Editar';
      this.dialog = !this.dialog;
      this.cidade.id = item.id;
      this.cidade.nome = item.nome;
      this.cidade.uf = item.uf;
    },
    
    excluir(item) {
      Swal.fire({
        title: `Cidade será deletada!`,
        text: `Deseja remover esse registro?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#007744",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: `Sim, pode deletar`,
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          let url = '/api/v1/excluir-cidade/' + item;
          let res = await axios.delete(url);
          console.log(res);
          if (res.data.status) {
            Swal.fire({
              title: "Excluido!",
              text: res.data.message,
              icon: "success",
              confirmButtonColor: "#007744",
            });
            this.carregar_cidades();
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
  width: 98%!important;
  margin: 0 auto;
}

.button-cadastro {
  color: rgba(255, 255, 255, 0.9) !important;
}
</style>