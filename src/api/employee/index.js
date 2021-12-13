import { doAxiosGet } from '../index';

function getPositions() {
    return doAxiosGet('/employee/positions');
}

export { getPositions };
