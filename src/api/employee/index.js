import { doAxios, doAxiosGet } from '../index';

function getPositions() {
    return doAxiosGet('/employee/positions');
}

function getEmployeeList(param) {
    const { departmentId } = param;
    return doAxios(`/employee/department/${departmentId}`, 'get', param);
}

export { getPositions, getEmployeeList };
