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
      :items="desserts"
      :items-per-page="8"
      class="elevation-1"
    >
    </v-data-table>
  </div>

  
</template>

<script>

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

      cidades: ['Dourados', 'Douradina', 'Naviraí', 'São Gabriel do Oeste', 'Mariluz', 'Umuarama'],
      permissoes: ['Administrador', 'Avaliador'],
      
      headers: [
        {
          text: 'Nome',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'CPF', value: 'cpf' },
        { text: 'Telefone', value: 'telefone' },
        { text: 'Cidade', value: 'cidade' },
        { text: 'tipo de acesso', value: 'acesso' },
      ],

      desserts: [
        {
          id: 'Afonso Barbosa de Souza',
          cpf: '066.661-741-43',
          telefone: '(67) 99234-5355',
          cidade: 'Dourados',
          acesso: 'Avaliador',
        },

        {
          id: 'Marcos lopes gonçalves',
          cpf: '066.661-741-43',
          telefone: '(67) 99823-1231',
          cidade: 'São Gabriel do Oeste',
          acesso: 'Administrador',
        },

        {
          id: 'Jack da Costa Brito',
          cpf: '066.661-741-43',
          telefone: '(67) 97121-4342',
          cidade: 'Vicentina',
          acesso: 'Avaliador',
        },

        {
          id: 'Afonso Barbosa de Souza',
          cpf: '066.661-741-43',
          telefone: '(67) 99234-5355',
          cidade: 'Dourados',
          acesso: 'Administrador',
        },

        {
          id: 'Marcos lopes gonçalves',
          cpf: '066.661-741-43',
          telefone: '(67) 99823-1231',
          cidade: 'São Gabriel do Oeste',
          acesso: 'Administrador',
        },

        {
          id: 'Jack da Costa Brito',
          cpf: '066.661-741-43',
          telefone: '(67) 97121-4342',
          cidade: 'Vicentina',
          acesso: 'Avaliador',
        },

        {
          id: 'Afonso Barbosa de Souza',
          cpf: '066.661-741-43',
          telefone: '(67) 99234-5355',
          cidade: 'Dourados',
          acesso: 'Avaliador',
        },

        {
          id: 'Marcos lopes gonçalves',
          cpf: '066.661-741-43',
          telefone: '(67) 99823-1231',
          cidade: 'São Gabriel do Oeste',
          acesso: 'Administrador',
        },

        {
          id: 'Jack da Costa Brito',
          cpf: '066.661-741-43',
          telefone: '(67) 97121-4342',
          cidade: 'Vicentina',
          acesso: 'Avaliador',
        },
      ],
    }
  },

  methods: {
    modal(){
      this.dialog = !this.dialog
    }
  },
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