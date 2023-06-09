import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueColumnsResizableVuetify from 'vue-columns-resizable-vuetify';

import VueCookie from 'vue-cookie';
import VueGeolocationApi from 'vue-geolocation-api';

Vue.use(VueCookie);
Vue.use(VueGeolocationApi /*, { ...options } */);
Vue.use(VueColumnsResizableVuetify);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount('#app');
