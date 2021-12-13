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

function getAccount(accountId) {
    return doAxiosGet(`/account/${accountId}`);
}

function saveAccount(param) {
    return doAxiosPost('/account', param);
}

function updateAccount(param) {
    return doAxiosPut('/account', param);
}

function checkDupEmail(email) {
    return doAxiosGet(`/account/check-email/${email}`);
}

export { getDepartmentList, saveDepartment, modifyDepartment, saveAccount, checkDupEmail, getAccount, updateAccount };
