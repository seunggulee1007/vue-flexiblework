import store from '@/store';
import router from '@/router';

let isTokenRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = accessToken => {
    refreshSubscribers.map(callback => callback(accessToken));
    refreshSubscribers = [];
};

const addRefreshSubscriber = callback => {
    refreshSubscribers.push(callback);
};

function setInterceptors(instance) {
    // Add a request interceptor
    instance.interceptors.request.use(
        function (config) {
            store.commit('startSnackbar');
            // Do something before request is sent
            // test comment
            config.headers['X-SEPARTNERS-AUTH'] = `Bearer ${store.getters.getAccessToken}`;
            return config;
        },
        function (error) {
            // Do something with request error
            return Promise.reject(error);
        },
    );
    // Add a response interceptor
    instance.interceptors.response.use(
        function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            store.commit('processStop');
            if (response.config.method !== 'get') {
                store.commit('setSanckbarMessage', response.data.message);
                store.commit('setSnackbarColor', 'light-blue accent-2');
                store.commit('setSnackbarTimeout', 5000);
                store.commit('endSnackbar');
            }
            return response.data;
        },
        async function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            store.commit('processStop');
            console.log(error.response);
            if (error.response) {
                const {
                    config,
                    response: { status },
                    response: { data },
                } = error;
                console.log('401떴으면 여기 와야 하는 거 아니냐? ㅋㅋ');
                if (status === 401) {
                    const originalRequest = config;
                    console.log('이것도 좀 확인하고', data.status);
                    if (data && data.status == -401) {
                        store.commit('clearLoginInfo');
                        store._vm.$cookie.delete(process.env.VUE_APP_AUTH_TOKEN);
                        store._vm.$cookie.delete(process.env.VUE_APP_USER_ID);
                        store._vm.$cookie.delete(process.env.VUE_APP_AUTH_REFRESH_TOKEN);
                        router.push('/authentication/sign-in');
                        return Promise.reject(error);
                    }
                    // token이 재발급 되는 동안의 요청은 refreshSubscribers에 저장
                    const retryOriginalRequest = new Promise(resolve => {
                        addRefreshSubscriber(accessToken => {
                            originalRequest.headers['X-SEPARTNERS-AUTH'] = `Bearer ${accessToken}`;
                            resolve(instance(originalRequest));
                        });
                    });
                    console.log('토큰 재발급 되는 동안 저장을 할 거고....');
                    if (!isTokenRefreshing) {
                        console.log('토큰 재발행 하나?');
                        isTokenRefreshing = true;
                        const refreshToken = store.getters.getRefreshToken;

                        await instance
                            .get(`${process.env.VUE_APP_API_URL}/api/sign/refresh-token/${refreshToken}`)
                            .then(({ response }) => {
                                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response;
                                store.commit('setAccessToken', newAccessToken);
                                store.commit('setRefreshToken', newRefreshToken);
                                store._vm.$cookie.set(process.env.VUE_APP_AUTH_TOKEN, newAccessToken);
                                store._vm.$cookie.set(process.env.VUE_APP_AUTH_REFRESH_TOKEN, newRefreshToken);
                                isTokenRefreshing = false;
                                instance.defaults.headers['X-SEPARTNERS-AUTH'] = `Bearer ${newAccessToken}`;
                                onTokenRefreshed(newAccessToken);
                            })
                            .catch(() => {
                                isTokenRefreshing = false;
                            });
                    }
                    return retryOriginalRequest;
                }
            }
            return Promise.reject(error);
        },
    );
    return instance;
}
export { setInterceptors };
