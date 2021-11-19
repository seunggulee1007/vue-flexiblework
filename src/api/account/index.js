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

function getEmployeeList(param) {
    return doAxiosGet('/employee/list', param);
}

function fakeCallFromApi(param) {
    return new Promise(resolve => {
        const { sortBy, sortDesc, page, itemsPerPage } = param.options;
        const search = param.search.toLowerCase();

        const res = {
            success: true,
            response: [
                {
                    employeeId: 1,
                    accountId: 1,
                    userName: '이승구',
                    email: 'leesg107@naver.com',
                    hireDate: '2021-11-19T09:53:16.625994',
                    employeeDepartmentList: null,
                },
                {
                    employeeId: 2,
                    accountId: 2,
                    userName: '전승호',
                    email: 'devshjeon@gmail.com',
                    hireDate: '2021-11-20T09:53:16.625994',
                    employeeDepartmentList: null,
                },
                {
                    employeeId: 3,
                    accountId: 3,
                    userName: '철수',
                    email: 'test1@gmail.com',
                    hireDate: '2021-11-20T09:53:16.625994',
                    employeeDepartmentList: null,
                },
                {
                    employeeId: 4,
                    accountId: 4,
                    userName: '훈이',
                    email: 'test2@gmail.com',
                    hireDate: '2021-11-20T09:53:16.625994',
                    employeeDepartmentList: null,
                },
                {
                    employeeId: 5,
                    accountId: 5,
                    userName: '맹구',
                    email: 'test3@gmail.com',
                    hireDate: '2021-11-20T09:53:16.625994',
                    employeeDepartmentList: null,
                },
                {
                    employeeId: 6,
                    accountId: 6,
                    userName: '유리',
                    email: 'test4@gmail.com',
                    hireDate: '2021-11-20T09:53:16.625994',
                    employeeDepartmentList: null,
                },
                {
                    employeeId: 7,
                    accountId: 7,
                    userName: '원장선생님',
                    email: 'test4@gmail.com',
                    hireDate: '2021-11-20T09:53:16.625994',
                    employeeDepartmentList: null,
                },
                {
                    employeeId: 8,
                    accountId: 8,
                    userName: '짱구아빠',
                    email: 'test4@gmail.com',
                    hireDate: '2021-11-20T09:53:16.625994',
                    employeeDepartmentList: null,
                },
                {
                    employeeId: 9,
                    accountId: 9,
                    userName: '짱구엄마',
                    email: 'test4@gmail.com',
                    hireDate: '2021-11-20T09:53:16.625994',
                    employeeDepartmentList: null,
                },
            ],
            message: '처리되었습니다.',
            status: 200,
        };
        let items = res.response.filter(item => item['userName'].toLowerCase().includes(search));
        const total = items.length;

        if (sortBy.length === 1 && sortDesc.length === 1) {
            items = items.sort((a, b) => {
                const sortA = a[sortBy[0]];
                const sortB = b[sortBy[0]];

                if (sortDesc[0]) {
                    if (sortA < sortB) return 1;
                    if (sortA > sortB) return -1;
                    return 0;
                } else {
                    if (sortA < sortB) return -1;
                    if (sortA > sortB) return 1;
                    return 0;
                }
            });
        }

        if (itemsPerPage > 0) {
            items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        }

        res.response = items;
        res['total'] = total;

        setTimeout(() => {
            resolve({
                ...res,
            });
        }, 1000);
    });
}

export { getDepartmentList, saveDepartment, modifyDepartment, getEmployeeList, fakeCallFromApi };
