import { doAxiosGet, doAxiosPost, doAxiosPut } from '../index';

function getDepartmentManagementList() {
    return doAxiosGet('/department-management/list');
}

function saveDepartmentManagement(param) {
    return doAxiosPost('/department-management', param);
}

function modifyDepartmentManagement(param) {
    return doAxiosPut('/department-management', param);
}

export { getDepartmentManagementList, saveDepartmentManagement, modifyDepartmentManagement };
