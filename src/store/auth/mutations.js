export default {
    /**
     * 로그인 이후 state에  데이터 저장
     * @param {*} state
     * @param {*} data
     */
    setLoginInfo(state, data) {
        state.email = data.email;
        state.accountId = data.accountId;
        state.accessToken = data.accessToken;
        state.refreshToken = data.refreshToken;
        state.userName = data.userName;
        state.account = data;
        state.superAdmin = data.superAdmin;
    },
    /**
     * 로그 아웃 이후 state에 내용 빈값으로 초기화
     * @param {*} state
     */
    clearLoginInfo(state) {
        this._vm.$cookie.delete(process.env.VUE_APP_AUTH_TOKEN);
        this._vm.$cookie.delete(process.env.VUE_APP_EMAIL);
        this._vm.$cookie.delete(process.env.VUE_APP_AUTH_REFRESH_TOKEN);
        state.email = '';
        state.accessToken = '';
        state.accountId = '';
        state.refreshToken = '';
        state.userName = '';
        state.superAdmin = false;
    },
    setAccessToken(state, token) {
        state.accessToken = token;
    },
    setRefreshToken(state, refreshToken) {
        state.refreshToken = refreshToken;
    },
    setProfileImage(state, profileImage) {
        state.account.profileImage = profileImage;
    },
};
