import { doAxios } from '../..';
function getAuthorityGroupList(param) {
    return doAxios('/authority/group', 'get', param);
}

export { getAuthorityGroupList };
