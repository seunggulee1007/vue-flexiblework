import { doAxiosPost } from '@/api';

function saveEmployeeDepartment(param) {
    return doAxiosPost(`/employee/department`, param);
}

export { saveEmployeeDepartment };
