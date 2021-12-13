import { doAxiosGet } from '../..';

function getAuthorityGroupByMenuId(menuId) {
    return doAxiosGet(`/menu/authority/id/${menuId}`);
}

export { getAuthorityGroupByMenuId };
