<template>
  <div class="cadastro-trabalho">

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <b>Submeter trabalho</b>
        </v-card-title>
        <v-divider></v-divider>

        <v-form ref="form" class="pa-8 mx-auto">

          <v-card>
            <v-slider
              v-model="value"
              :rules="rules"
              label="Qntde. Autores"
              step="1"
              thumb-label="always"
              ticks
            ></v-slider>

          </v-card>

          <v-text-field
            v-model="trabalho.titulo"
            label="Titulo:"
            required
          ></v-text-field>

          <v-text-field
            v-model="trabalho.palavra_chave"
            label="Palavras-chave:"
            required
          ></v-text-field>

          <v-textarea
            name="input-7-1"
            label="Texto do trabalho"
            value="teste teste teste teste"
            v-model="trabalho.conteudo"
          ></v-textarea>

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
      <h2>Submissão de trabalhos</h2>
      
      <v-btn tile class="button-cadastro" color="#07759e" @click="modal">
        <v-icon left>
          mdi-pencil
        </v-icon>

        Submeter trabalho
      </v-btn>
    </v-row>
  </div>

  
</template>

<script>

export default {
  name: 'trabalhos',

  data: ()=>{

    return{
      dialog: false,

      trabalho:{
        titulo: '',
        palavra_chave: '',
        conteudo: ''
      },
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

  .cadastro-trabalho h2{
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