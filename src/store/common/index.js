import actions from './action';
import mutations from './mutation';
import getters from './getter';
export default {
    state: () => ({
        userDialog: false,
        deptDialog: false,
        naviFlag: true,
        processMsg: '처리중입니다.',
        process: false,
    }),
    getters,
    mutations,
    actions,
};
