export default {
    isLogin(state) {
        return state.accessToken !== '';
    },
    getAccessToken(state) {
        return state.accessToken;
    },
    getRefreshToken(state) {
        return state.refreshToken;
    },
    getEmail(state) {
        return state.email;
    },
    getUserName(state) {
        return state.userName;
    },
    ACCOUNT(state) {
        return state.account;
    },
    isSuperAdmin(state) {
        return state.superAdmin;
    },
};
