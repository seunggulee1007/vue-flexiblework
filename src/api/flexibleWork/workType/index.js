import { doAxios, doAxiosGet, doAxiosPost } from '../..';

function getFlexibleWorkList(param) {
    return doAxios('/flexible-work/list', 'get', param);
}
function getCodeList() {
    return doAxiosGet('/flexible-work/codes');
}

function saveFlexibleWork(param) {
    return doAxiosPost('/flexible-work', param);
}
export { getCodeList, saveFlexibleWork, getFlexibleWorkList };
