import { doAxiosGet, doAxios } from '../index';

function getPositions() {
    return doAxiosGet('/employee/positions');
}

function getEmployeeList(param) {
    return doAxios(`/employee/searchform`, param);
}

export { getPositions, getEmployeeList };
