import Vue from 'vue';
import Vuex from 'vuex';
import Common from './common';
import Auth from './auth';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Common,
        Auth,
    },
    plugins: [
        createPersistedState({
            paths: ['Auth'],
        }),
    ],
});
