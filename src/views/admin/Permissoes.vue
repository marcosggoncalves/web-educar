<template>
  <div class="cadastro-permissao">

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <b>Cadastrar permissão</b>
        </v-card-title>
        <v-divider></v-divider>

        <v-form ref="form" class="pa-8 mx-auto">
          <v-text-field
            v-model="permissao.nome_permissao"
            label="Nome:"
            required
          ></v-text-field>

          <v-text-field
            v-model="permissao.rota_api"
            label="rota API:"
            required
          ></v-text-field>
          
          <v-text-field
            v-model="permissao.rota_web"
            label="rota WEB:"
            required
          ></v-text-field>

          <v-switch
            v-model="switch1"
            flat
            :label="`Menu?: ${switch1.toString()}`"
          ></v-switch>

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
      <h2>Cadastro de permissões</h2>
      
      <v-btn tile class="button-cadastro" color="#00a65a" @click="modal">
        <v-icon left>
          mdi-pencil
        </v-icon>

        Cadastrar permissão
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
  name: 'permissoes',

  data: ()=>{

    return{
      dialog: false,
      switch1: false,

      permissao:{
        nome_permissao: '',
        rota_api: '',
        rota_web: '',

      },
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Nome', value: 'nome' },
        { text: 'Rota API', value: 'rota_api' },
        { text: 'Rota WEB', value: 'rota_web' },
      ],

      desserts: [
        {
          id: '1',
          nome: 'cadastro de usuario',
          rota_api: '/api/2021/admin/usuario',
          rota_web: '/web/admin/usuario'
        },

        {
          id: '2',
          nome: 'cadastro de usuario',
          rota_api: '/api/2021/admin/usuario',
          rota_web: '/web/admin/usuario'
        },

        {
          id: '3',
          nome: 'cadastro de usuario',
          rota_api: '/api/2021/admin/usuario',
          rota_web: '/web/admin/usuario'
        },

        {
          id: '4',
          nome: 'cadastro de usuario',
          rota_api: '/api/2021/admin/usuario',
          rota_web: '/web/admin/usuario'
        },

        {
          id: '5',
          nome: 'cadastro de usuario',
          rota_api: '/api/2021/admin/usuario',
          rota_web: '/web/admin/usuario'
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

  .cadastro-permissao h2{
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