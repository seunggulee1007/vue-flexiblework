import { doAxiosGet, doAxiosPost, doAxiosPut } from '../index';

function getDepartmentList() {
    return doAxiosGet('/department/list');
}

function saveDepartment(param) {
    return doAxiosPost('/department', param);
}

function modifyDepartment(param) {
    return doAxiosPut('/department', param);
}

export { getDepartmentList, saveDepartment, modifyDepartment };
