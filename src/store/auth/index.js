import { getCookie } from '@/utils/cookies';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

let Auth = {
    state: () => ({
        email: getCookie(process.env.VUE_APP_EMAIL) || '',
        accessToken: getCookie(process.env.VUE_APP_AUTH_TOKEN) || '',
        refreshToken: getCookie(process.env.VUE_APP_AUTH_REFRESH_TOKEN) || '',
        userName: '',
        accountId: 0,
        account: {},
    }),
    getters,
    mutations,
    actions,
};

export default Auth;
