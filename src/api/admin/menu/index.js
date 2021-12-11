import { doAxiosGet, doAxiosPost, doAxiosPut } from '../..';

function getMenuList() {
    return doAxiosGet('/menu/list');
}

function saveMenu(param) {
    return doAxiosPost('/menu', param);
}

function modifyMenu(param) {
    return doAxiosPut('/menu', param);
}

function changeOrderNumber(param) {
    return doAxiosPut('/menu/ordernumber', param);
}

export { getMenuList, saveMenu, modifyMenu, changeOrderNumber };
