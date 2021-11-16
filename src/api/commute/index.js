import { doAxiosGet, doAxiosPost } from '../index';

function getMyCommute() {
    return doAxiosGet('/commute/my');
}

function doCommute(param) {
    return doAxiosPost('/commute', param);
}
export { getMyCommute, doCommute };
