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
    store.commit('processStart');
    return instance.post(url, param).catch(errFunction);
}

function doAxiosPut(url, param) {
    store.commit('processStart');
    return instance.put(url, param).catch(errFunction);
}

function doAxiosGet(url, param) {
    store.commit('setProcessMsg', '조회중입니다.');
    store.commit('processStart');
    return instance.get(url, { data: param }).catch(errFunction);
}

function doAxiosDelete(url, param) {
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
    const data = {};
    if (error.response) {
        const {
            response: { data },
        } = error;
        return data;
    } else if (!error.status) {
        data.success = false;
        data.message = '네트워크 연결을 확인해 주세요.';
    }
    return data;
}

export { createInstance, doAxios, doAxiosDelete, doAxiosGet, doAxiosPost, doAxiosPut };
