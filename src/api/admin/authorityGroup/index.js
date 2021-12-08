function getAuthorityGroupList() {
    return new Promise(resolve => {
        const res = {
            success: true,
            response: authorityGroupList,
            status: 200,
        };
        setTimeout(() => {
            resolve({ ...res });
        }, 1000);
    });
}

export { getAuthorityGroupList };
const authorityGroupList = [
    {
        authorityGroupId: 1,
        authorityGroupName: '기본권한그룹',
        active: true,
        basic: true,
        admin: false,
        employeeCount: 15,
    },
    {
        authorityGroupId: 2,
        authorityGroupName: '경원지원그룹',
        active: true,
        basic: false,
        admin: false,
        employeeCount: 32,
    },
];
