function getAuthorityGroupByMenuId(menuId) {
    const list = authorityGroup.filter(data => data.menuId == menuId);
    let groupList = new Array();
    if (list.length > 0) {
        groupList = list[0].groupList;
    }
    return new Promise(resolve => {
        const res = {
            success: true,
            response: groupList,
            status: 200,
        };
        setTimeout(() => {
            resolve({ ...res });
        }, 1000);
    });
}

export { getAuthorityGroupByMenuId };
const authorityGroup = [
    {
        menuId: 1,
        groupList: [
            { authorityGroupId: 1, authorityGroupName: '관리자', menuRole: 'NONE' },
            { authorityGroupId: 2, authorityGroupName: '개발부', menuRole: 'READ' },
            { authorityGroupId: 3, authorityGroupName: '인사부', menuRole: 'READ' },
        ],
    },
    {
        menuId: 2,
        groupList: [
            { authorityGroupId: 1, authorityGroupName: '관리자', menuRole: 'NONE' },
            { authorityGroupId: 2, authorityGroupName: '개발부', menuRole: 'WRITE' },
            { authorityGroupId: 3, authorityGroupName: '인사부', menuRole: 'READ' },
        ],
    },
    {
        menuId: 3,
        groupList: [
            { authorityGroupId: 1, authorityGroupName: '관리자', menuRole: 'NONE' },
            { authorityGroupId: 2, authorityGroupName: '개발부', menuRole: 'WRITE' },
            { authorityGroupId: 3, authorityGroupName: '인사부', menuRole: 'READ' },
        ],
    },
];
