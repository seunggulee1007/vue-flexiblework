import axios from 'axios';
import { setInterceptors } from '@/api/common';
import store from '@/store';
function createInstance() {
    const instance = axios.create({
        baseURL: `${process.env.VUE_APP_API_URL}/api`,
    });
    return setInterceptors(instance);
}

const instance = createInstance();

function doAxiosPost(url, param) {
    store.commit('setProcessMsg', '처리중입니다.');
    store.commit('processStart');
    return instance.post(url, param).catch(errFunction);
}

function doAxiosPut(url, param) {
    store.commit('setProcessMsg', '처리중입니다.');
    store.commit('processStart');
    return instance.put(url, param).catch(errFunction);
}

function doAxiosGet(url, param) {
    store.commit('setProcessMsg', '조회중입니다.');
    store.commit('processStart');
    return instance.get(url, { data: param }).catch(errFunction);
}

function doAxiosDelete(url, param) {
    store.commit('setProcessMsg', '처리중입니다.');
    store.commit('toggleProcess');
    return instance.delete(url, { data: param }).catch(errFunction);
}

function doAxios(url, method, params, config) {
    return instance({
        url,
        method,
        params,
        config,
    });
}

function errFunction(error) {
    store.commit('processStop');
    let res = {};
    if (error.response) {
        const {
            response: { data },
        } = error;
        res = data;
    } else if (!error.status) {
        res.success = false;
        res.message = '네트워크 연결을 확인해 주세요.';
    }
    if (res.message && res.status != 401) {
        store.commit('setSanckbarMessage', res.message);
        store.commit('setSnackbarTimeout', 5000);
        store.commit('setSnackbarColor', 'orange lighten-1');
        store.commit('endSnackbar');
    }
    return res;
}

export { createInstance, doAxios, doAxiosDelete, doAxiosGet, doAxiosPost, doAxiosPut };
