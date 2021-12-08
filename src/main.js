import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import mixins from './plugins/mixins';
import VueColumnsResizableVuetify from 'vue-columns-resizable-vuetify';

import VueCookie from 'vue-cookie';
import VueGeolocationApi from 'vue-geolocation-api';

Vue.use(VueCookie);
Vue.use(VueGeolocationApi /*, { ...options } */);
Vue.use(VueColumnsResizableVuetify);
Vue.config.productionTip = false;
Vue.mixin(mixins);
// 통화로 변경해 주는 필터링
Vue.filter('currency', function (value, flag) {
    if (!value) {
        return value;
    } else {
        value = value.toString();
        if (value.indexOf('.') != -1) {
            // 소수점 들어왔을 시
            if (flag) {
                // 반올림 여부
                value = Math.round(value);
            } else {
                let values = value.split('.');
                return values[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + values[1];
            }
        }
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
});

// 넘겨진 번호를 사업자 번호 포맷에 맞춰서 마스킹 해주는 필터링
Vue.filter('bizNoFilter', function (value, type) {
    if (!value) return;
    if (value.includes('-')) {
        return value;
    }
    var formatNum = '';
    try {
        if (value.length == 10) {
            if (type == 0) {
                formatNum = value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-*****');
            } else {
                formatNum = value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
            }
        }
    } catch (e) {
        formatNum = value;
    }
    return formatNum;
});

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount('#app');
