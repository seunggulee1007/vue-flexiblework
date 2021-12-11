import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
    breakpoint: {
        mobileBreakpoint: 'sm', // This is equivalent to a value of 960
    },
    theme: {
        themes: {
            light: {
                primary: colors.blue.darken1, // #E53935
                secondary: colors.lightBlue.darken1, // #FFCDD2
                accent: colors.indigo.base, // #3F51B5
                cancel: colors.grey.darken1,
                modal: colors.indigo.darken2,
            },
        },
    },
});
