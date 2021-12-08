function getMenuList() {
    return new Promise(resolve => {
        const res = {
            success: true,
            response: menuList,
            status: 200,
        };
        setTimeout(() => {
            resolve({ ...res });
        }, 1000);
    });
}

export { getMenuList };

const menuList = [
    {
        menuName: 'Separtners',
        menuId: 1,
        path: '',
        active: true,
        children: [
            {
                menuName: '유연근무관리',
                menuId: 2,
                path: '',
                active: true,
                children: [],
            },
            {
                menuName: '기준정보관리',
                menuId: 3,
                path: '',
                active: true,
                children: [],
            },
        ],
    },
];
