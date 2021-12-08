import { doAxios, doAxiosGet } from '../index';

function getPositions() {
    return doAxiosGet('/employee/positions');
}

function getEmployeeList(param) {
    const { departmentId } = param;
    return doAxios(`/employee/departmentless/id/${departmentId}`, 'get', param);
}

export { getPositions, getEmployeeList };
