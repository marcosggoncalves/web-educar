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
            v-model="usuario.nome_usuario"
            label="Nome:"
            required
          ></v-text-field>

          <v-text-field
            v-model="usuario.cpf"
            label="CPF:"
            required
          ></v-text-field>

          <v-text-field
            v-model="usuario.telefone"
            label="Telefone:"
            required
          ></v-text-field>

          <v-select
            :items="cidades"
            label="Cidade"
          ></v-select>

          <v-select
            :items="permissoes"
            label="Permissão"
          ></v-select>

          <v-btn color="error" class="mr-4 mt-6" @click="modal">
            <v-icon dark> mdi-close </v-icon>
          </v-btn>

          <v-btn
            color="#046c34"
            outlined
            class="mr-4 mt-6"
            @click="modal"
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
import axios from '../../../axios/service_public.js';
export default {
  name: 'usuarios',
  data: ()=>{
    
    return{
      dialog: false,

      usuario:{
        nome_usuario: '',
        cpf_usuario: '',
        telefone_usuario: '',
        cidade_usuario: '',
        permissao_usuario: ''
      },

      cidades: [],
      permissoes: ['Administrador', 'Avaliador'],
      
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

      usuarios: [],
    }
  },

  methods: {
    modal(){
      this.dialog = !this.dialog
    },

    carregar_cidades(){
      axios.get("/api/v1/cidades", {
        headers:{

          'Authorization': 'Bearer ' + localStorage.getItem('token_uems')
        }
      })

      .then(response=>{

        if(response.data.status){
          for(let i = 0; i < response.data.cidades.data.length; i++){

            this.cidades.push(response.data.cidades.data[i].nome);
          }
        }
      })

      .catch(error=>{
        console.log('[ERRO AO CARREGAR CATEGORIAS]: ' + error);
      })
    },

    carregar_usuarios(){

      axios.get('/api/v1/usuarios', {
        headers:{
          'Authorization': 'Bearer ' + localStorage.getItem('token_uems')
        }
      }).

      then(response=>{

        if(response.data.status){

          this.usuarios = response.data.usuarios.data;
        }
      })

      .catch(error=>{
        console.log('[ERRO AO CARREGAR USUARIOS]: ' + error);
      })
    }


  },

  mounted(){

    this.carregar_cidades();
    this.carregar_usuarios();
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