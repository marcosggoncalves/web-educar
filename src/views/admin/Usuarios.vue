<template>
  <div class="cadastro-usuario">

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <b>Cadastrar usuário</b>
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

    <v-row align="center" justify="space-between" class="linha-top">
      <h2>Cadastro de usuários</h2>
      
      <v-btn tile class="button-cadastro" color="#00a65a" @click="modal">
        <v-icon left>
          mdi-pencil
        </v-icon>

        Cadastrar usuário
      </v-btn>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="usuarios"
      :items-per-page="8"
      class="elevation-1"
    >
    </v-data-table>
  </div>

  
</template>

<script>
import axios from '../../../axios/service.js';
export default {
  name: 'usuarios',
  data: ()=>{
    
    return{
      dialog: false,
      show: false,
      carregandoSave: false,

      usuario:{
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
      
      headers: [
        {
          text: 'Nome',
          align: 'start',
          sortable: false,
          value: 'nome',
        },
        { text: 'Email', value: 'email' },
        { text: 'Permissão', value: 'grupo_acesso' },
        { text: 'tipo usuario', value: 'tipo_usuario' },
        { text: 'Instituição', value: 'instituicao_nome' },
      ],

    }
  },

  methods: {

    clear(){
      this.error = {};
      this.usuario = {};

    },
    modal(){
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
      axios.post('/api/v1/novo-usuario', {
        nome: this.usuario.nome,
        senha: this.usuario.senha,
        email: this.usuario.email,
        grupo_id: this.usuario.grupo_id,
        tipo_usuario: 'Organização',
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