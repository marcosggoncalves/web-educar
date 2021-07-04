<template>
  <div class="cadastro-instituicao">

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <b>{{title}} instituição</b>
        </v-card-title>
        <v-divider></v-divider>

        <v-form ref="form" class="pa-8 mx-auto">
          <v-text-field
            v-model="inst.nome_instituicao"
            label="Nome da instituição:"
            required
            :error-messages="error.nome"
          ></v-text-field>

           <v-autocomplete
                :items="cidades"
                label="Cidade"
                v-model="inst.cidade"
                item-value="id"
                item-text="nome"
                auto-select-first
                chips
                clearable
                dense
                deletable-chips
                required
                :error-messages="error.nome"
              ></v-autocomplete>

          <v-btn color="error" class="mr-4 mt-6" @click="modal">
            <v-icon dark> mdi-close </v-icon>
          </v-btn>

          <v-btn
            color="#046c34"
            outlined
            class="mr-4 mt-6"
            @click="cadastro_instituicao"
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
          <h2>Cadastro de instituições</h2>
          
          <v-btn tile class="button-cadastro" color="#07759e" @click="modal">
            <v-icon left>
              mdi-pencil
            </v-icon>

            Cadastrar instituição
          </v-btn>
        </v-row>
      </template>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Nome</th>
            <th class="text-left">Criado em</th>
            <th class="text-left">Ações</th>
          </tr>
        </thead>
        <tbody v-if="instituicoes.length > 0">
          <tr v-for="item in instituicoes" :key="item.id">
            <td class="text-left">{{ item.id }}</td>
            <td class="text-left">{{ item.nome }}</td>
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
import axios from '../../../axios/service.js';
import Swal from "sweetalert2";

export default {
  name: 'instituicoes',

  data: ()=>{

    return{

      title: 'Cadastrar',
      dialog: false,
      carregandoSave: false,

      inst:{
        id: '',
        nome_instituicao: '',
        cidade: ''
      },

      error: {
        nome_instituicao: '',
        cidade: ''
      },

      cidades: [],

      instituicoes: [],
    }
  },

  methods:{

    clear(){
      this.inst = {};
      this.error= {};
    },

    modal(){
      this.title = 'Cadastrar';
      this.dialog = !this.dialog;
    },

    carregar_instituicoes(){
      axios.get('/api/v1/instituicoes-all').

      then(response=>{

        if(response.data.status){
          this.instituicoes = response.data.instituicoes;
        }
      })

      .catch(error=>{

        console.log('[ERRO AO CARREGAR AS INSTITUIÇÕES]: ' + error);
      })
    },

    carregar_cidades(){
      axios.get('/api/v1/cidades-all').

      then(response=>{
        if(response.data.status){
          this.cidades = response.data.cidades;
        }
      })

      .catch(error=>{
        console.log('[ERRO AO CARREGAR AS CIDADES]: ' + error);
      })
    },

    cadastro_instituicao(){
      
      let url = this.inst.id ? '/api/v1/alterar-instituicao/' + this.inst.id : '/api/v1/nova-instituicao';
      this.carregandoSave = true;
      axios.post(url, {
        nome: this.inst.nome_instituicao,
        cidade_id: this.inst.cidade
      }).

      then(response=>{
        if(response.data.status){
          this.$toast.open({
            message: response.data.message,
            type: "success",
          });

          this.dialog = !this.dialog;
          this.carregandoSave = false;
          this.carregar_instituicoes();
          
          this.clear();
        }
      })

      .catch(res=>{
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

        this.carregandoSave = !this.carregandoSave;
      })
    },

    editar(item){
      this.title = 'Editar';
      this.dialog = !this.dialog;
      this.inst.id = item.id;
      this.inst.nome_instituicao = item.nome;
      this.isnt.cidade = item.cidade_id;
    },
    
    excluir(item) {
      Swal.fire({
        title: `A instituição será deletada!`,
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
          let url = '/api/v1/excluir-instituicao/' + item;
          let res = await axios.delete(url);
          console.log(res);
          if (res.data.status) {
            Swal.fire({
              title: "Excluida!",
              text: res.data.message,
              icon: "success",
              confirmButtonColor: "#007744",
            });
            this.carregar_instituicoes();
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

  mounted(){
    this.carregar_instituicoes();
    this.carregar_cidades();
  }
}
</script>


<style>

  .cadastro-instituicao h2{
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .linha-top{
    width: 100%;
    margin: 0 auto;
  }

  .button-cadastro{
    color: rgba(255,255,255,0.9)!important;
  }

</style>