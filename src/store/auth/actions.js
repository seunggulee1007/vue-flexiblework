import { signIn } from '@/api/auth';
import { changeProfileImage } from '@/api/auth';
export default {
    async LOGIN({ commit }, params) {
        let res = await signIn(params);
        if (res.success) {
            commit('setLoginInfo', res.response);
            this._vm.$cookie.set(process.env.VUE_APP_AUTH_TOKEN, res.response.accessToken);
            this._vm.$cookie.set(process.env.VUE_APP_EMAIL, res.response.email);
            this._vm.$cookie.set(process.env.VUE_APP_AUTH_REFRESH_TOKEN, res.response.refreshToken);
        }
        return res;
    },
    async CHANGE_PROFILE_IMAGE({ commit }, params) {
        let res = await changeProfileImage(params);
        if (res.success) {
            commit('setProfileImage', res.response);
        }
        return res;
    },
};
