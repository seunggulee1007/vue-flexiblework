import { doAxiosGet } from '..';

function getCodeList() {
    return doAxiosGet('/flexible-work/codes');
}

export { getCodeList };
