import { doAxiosGet, doAxiosPost } from '..';

function getCodeList() {
    return doAxiosGet('/flexible-work/codes');
}

function saveFlexibleWork(param) {
    return doAxiosPost('/flexible-work', param);
}
export { getCodeList, saveFlexibleWork };
