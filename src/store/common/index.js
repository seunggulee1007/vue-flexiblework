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
        snackbar: false,
        snackbarMessage: '',
        snackbarTimeout: 3000,
        snackbarColor: 'light-blue accent-2',
    }),
    getters,
    mutations,
    actions,
};
