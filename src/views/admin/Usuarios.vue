<template>
  <div class="cadastro-usuario">

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <b>{{title}} usuário</b>
        </v-card-title>
        <v-divider></v-divider>

        <v-form ref="form" class="pa-8 mx-auto">
          <v-text-field
            v-model="usuario.nome"
            label="Nome:"
            required
            :error-messages="error.nome"
          ></v-text-field>

          <v-text-field
            v-model="usuario.email"
            label="Email:"
            required
            :error-messages="error.email"
          ></v-text-field>

          <v-autocomplete
            :items="grupos"
            label="Grupo de Permissões"
            v-model="usuario.grupo_id"
            item-value="id"
            item-text="nome"
            auto-select-first
            chips
            clearable
            dense
            deletable-chips
            :error-messages="error.grupo_id"
          ></v-autocomplete>

          <v-autocomplete
            :items="instituicoes"
            label="Instituição"
            v-model="usuario.instituicao_id"
            item-value="id"
            item-text="nome"
            auto-select-first
            chips
            clearable
            dense
            deletable-chips
            :error-messages="error.instituicao_id"
          ></v-autocomplete>

          <v-text-field
            v-model="usuario.senha"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            label="Senha:"
            required
            :error-messages="error.senha"
          ></v-text-field>

          <v-btn color="error" class="mr-4 mt-6" @click="modal">
            <v-icon dark> mdi-close </v-icon>
          </v-btn>

          <v-btn
            color="#046c34"
            outlined
            class="mr-4 mt-6"
            :loading="carregandoSave"
            @click="cadastrar_usuario_organizacao"
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
          <h2>Cadastro de usuários</h2>
          
          <v-btn tile class="button-cadastro" color="#07759e" @click="modal">
            <v-icon left>
              mdi-pencil
            </v-icon>

            Cadastrar usuário
          </v-btn>
        </v-row>
      </template>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Nome</th>
            <th class="text-left">Email</th>
            <th class="text-left">Permissão</th>
            <th class="text-left">Instituição</th>
            <th class="text-left">Tipo usuário</th>
            <th class="text-left">Ações</th>
          </tr>
        </thead>
        <tbody v-if="usuarios.length > 0">
          <tr v-for="item in usuarios" :key="item.id">
            <td class="text-left">{{ item.id }}</td>
            <td class="text-left">{{ item.nome }}</td>
            <td class="text-left">{{ item.email }}</td>
            <td class="text-left">{{ item.grupo_acesso}}</td>
            <td class="text-left">{{ item.instituicao_nome}}</td>
            <td class="text-left">{{ item.tipo_usuario}}</td>
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
  name: 'usuarios',
  data: ()=>{
    
    return{
      title: 'Cadastrar',
      dialog: false,
      show: false,
      carregandoSave: false,

      usuario:{
        id: '',
        nome: '',
        email: '',
        grupo_id: '',
        instituicao_id: '',
        senha: '',
      },

      error:{
        nome: '',
        email: '',
        grupo_id: '',
        instituicao_id: '',
        senha: '',
      },

      cidades: [],
      grupos: [],
      instituicoes: [],
      usuarios: [],
    }
  },

  methods: {

    clear(){
      this.error = {};
      this.usuario = {};

    },
    modal(){
      this.title = 'Cadastrar';
      this.dialog = !this.dialog;
    },

    carregar_cidades(){
      axios.get("/api/v1/cidades-all")

      .then(response=>{

        if(response.data.status){
          this.cidades = response.data.cidades;
        }
      })

      .catch(error=>{
        console.log('[ERRO AO CARREGAR CIDADES]: ' + error);
      })
    },

    carregar_usuarios(){

      axios.get('/api/v1/usuarios').

      then(response=>{

        if(response.data.status){

          this.usuarios = response.data.usuarios.data;
        }
      })

      .catch(error=>{
        console.log('[ERRO AO CARREGAR USUARIOS]: ' + error);
      })
    },

    carregar_instituicoes(){
      axios.get('/api/v1/instituicoes-all')

      .then(response=>{

        if(response.data.status){
          this.instituicoes = response.data.instituicoes;
        }
      })

      .catch(error=>{
        console.log('[ERRO AO CARREGAR INSTITUICOES]: ' + error);
      })
    },

    carregar_grupos_permissoes(){
      axios.get('/api/v1/grupos')

      .then(response=>{
        if(response.data.status){
          this.grupos = response.data.grupos.data;
        }
      })

      .catch(error=>{
        
        console.log('[ERRO AO CARREGAR GRUPOS DE PERMISSAO]: ' + error);
      })
    },

    cadastrar_usuario_organizacao(){
      this.carregandoSave = true;
      
      let url = this.usuario.id ? '/api/v1/alterar-usuario/' + this.usuario.id : '/api/v1/novo-usuario';
      axios.post(url, {
        nome: this.usuario.nome,
        senha: this.usuario.senha,
        email: this.usuario.email,
        grupo_id: localStorage.getItem('token_uems') ? this.usuario.grupo_id : 1,
        tipo_usuario: localStorage.getItem('token_uems') ? 'Organização' : 'Alunos',
        instituicao_id: this.usuario.instituicao_id
      })

      .then(response=>{
        if(response.data.status){
          this.$toast.open({
            message: response.data.message,
            type: "success",
          });
        }

        this.carregandoSave = false;
        this.dialog = !this.dialog;
        this.carregar_usuarios();
        this.clear();
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
        this.carregandoSave = false;
      });
    },

    editar(item){
      this.title = 'Editar';
      this.dialog = !this.dialog;
      this.usuario.id = item.id;
      this.usuario.nome = item.nome;
      this.usuario.email = item.email;
      this.usuario.grupo_id = item.grupo_id;
      this.usuario.instituicao_id = item.instituicao_id;
      this.usuario.senha = item.senha;

      console.log(this.usuario);
    },

    excluir(item){
      Swal.fire({
        title: `O usuário será deletado!`,
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
          let url = '/api/v1/excluir-usuario/' + item;
          let res = await axios.delete(url);
          console.log(res);
          if (res.data.status) {
            Swal.fire({
              title: "Excluido!",
              text: res.data.message,
              icon: "success",
              confirmButtonColor: "#007744",
            });
            this.carregar_usuarios();
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
    }

  },

  mounted(){

    this.carregar_cidades();
    this.carregar_usuarios();
    this.carregar_instituicoes();
    this.carregar_grupos_permissoes();
  }
}
</script>


<style>

  .cadastro-usuario h2{
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