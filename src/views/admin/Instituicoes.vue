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
          ></v-text-field>

           <v-select
            :items="cidades"
            label="Cidade"
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
      :items="desserts"
      :items-per-page="8"
      class="elevation-1"
    >
    </v-data-table>
  </div>

  
</template>

<script>

export default {
  name: 'instituicoes',

  data: ()=>{

    return{
      dialog: false,

      inst:{
        nome_instituicao: '',
        cidade: ''
      },

      cidades: ['Dourados', 'Douradina', 'Naviraí', 'São Gabriel do Oeste', 'Mariluz', 'Umuarama'],

      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Nome', value: 'nome' },
        { text: 'Cidade', value: 'cidade' },
        { text: 'criado em', value: 'criado_em' },
      ],

      desserts: [
        {
          id: '1',
          nome: 'Instituto Federal de mato grosso do Sul',
          cidade: 'Dourados',
          criado_em: '15/03/2021 12:10:00h',
        },

        {
          id: '2',
          nome: 'Escola Estadual Vilmar Vieira Mattos',
          cidade: 'Dourados',
          criado_em: '15/03/2021 12:10:00h',
        },

        {
          id: '3',
          nome: 'Escola Presidente Vargas',
          cidade: 'Dourados',
          criado_em: '15/03/2021 12:10:00h',
        },

        {
          id: '4',
          nome: 'Escola Filinto Muller',
          cidade: 'Dourados',
          criado_em: '15/03/2021 12:10:00h',
        },

        {
          id: '5',
          nome: 'Escola Apostólica Romana',
          cidade: 'Dourados',
          criado_em: '15/03/2021 12:10:00h',
        },

        {
          id: '6',
          nome: 'Escola Teste',
          cidade: 'Dourados',
          criado_em: '15/03/2021 12:10:00h',
        },
      ],
    }
  },

  methods:{

    modal(){
      this.dialog = !this.dialog;
    }
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