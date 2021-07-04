<template>
   <div class="center margin">
       <div>
           <v-icon size="90" color="#07759e">mdi-alert</v-icon>
       </div>
       <div>
           <h1>{{ message && message != null ? message : 'Nenhum cadastro encontrado /ou você pode estar sem permissão para acessar esse local!'}}</h1>
       </div>
   </div>
</template>

<script>
export default {
    props:["message"]
}
</script>

<style scoped>
    .center{
        display: flex;
        align-content: center;
        align-items: center;
        flex-direction: column;
        
        padding: 40px 40px;
    }

    .margin{
        margin-top:2rem;
    }

    img{
        width: 500px;
    }

    h1{
        color: #a1a1a1;
        font-size: 1.2rem;
        text-align: center;
    }
</style>