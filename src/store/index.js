import Vue from 'vue'
import Vuex from 'vuex'
import axios from "../../axios/service";
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
    mutations: {
        token: ({ commit }, token) => {
            commit('token_uems', token);
        }
    },
    actions: {
        async verifyToken() {
            let token =  window.localStorage.getItem('token_uems');

            try{
                const verify = await axios.get('/api/v1/auth/verificar-token', {}, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if(!verify.data.status){
                    window.localStorage.clear();
    
                    Vue.$toast.open({
                        message:verify.data.message,
                        type: "error",
                    });
                    router.push('/entrar');
                }

            }catch(error){
                console.log(error);
            }
        },
    },
    getters: {
        token: state => {
            return state.token
        }
    }
})