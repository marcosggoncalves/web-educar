<template>
  <div class="cadastro-instituicao">

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <b>Cadastrar instituição</b>
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
    <v-row align="center" justify="space-between" class="linha-top">
      <h2>Cadastro de instituições</h2>
      
      <v-btn tile class="button-cadastro" color="#00a65a" @click="modal">
        <v-icon left>
          mdi-pencil
        </v-icon>

        Cadastrar instituição
      </v-btn>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="instituicoes"
      :items-per-page="8"
      class="elevation-1"
    >
    </v-data-table>
  </div>

  
</template>

<script>
import axios from '../../../axios/service.js';
export default {
  name: 'instituicoes',

  data: ()=>{

    return{
      dialog: false,
      carregandoSave: false,

      inst:{
        nome_instituicao: '',
        cidade: ''
      },

      error: {
        nome_instituicao: '',
        cidade: ''
      },

      cidades: [],

      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Nome', value: 'nome' },
        { text: 'Cidade', value: 'cidade_id' },
        { text: 'criado em', value: 'created_at' },
      ],

      instituicoes: [],
    }
  },

  methods:{

    clear(){
      this.inst = {};
      this.error= {};
    },

    modal(){
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
      this.carregandoSave = true;
      axios.post('/api/v1/nova-instituicao', {
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
    }
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