import { doAxios, doAxiosGet, doAxiosPost } from '../..';
function getAuthorityGroupList(param) {
    return doAxios('/authority/group', 'get', param);
}

function confirmDuple(authorityGroupName) {
    return doAxiosGet(`/authority/group/confirm-duple/name/${authorityGroupName}`);
}

function saveAuthorityGroup(param) {
    return doAxiosPost('/authority/group', param);
}

export { getAuthorityGroupList, confirmDuple, saveAuthorityGroup };
