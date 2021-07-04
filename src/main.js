import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import found from "./views/components/found.vue";
/// Vue notification
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.config.productionTip = false;

Vue.component('found', found);

Vue.use(VueToast, {
  position: 'top-right'
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
