export default {
    isUserDialog(state) {
        return state.userDialog;
    },
    isDeptDialog(state) {
        return state.deptDialog;
    },
    isNaviFlag(state) {
        return state.naviFlag;
    },
    isProcess(state) {
        return state.process;
    },
    processMsg(state) {
        return state.processMsg;
    },
    isSnackbar(state) {
        return state.snackbar;
    },
    snackbarTimeout(state) {
        return state.snackbarTimeout;
    },
    snackbarMessage(state) {
        return state.snackbarMessage;
    },
    snackbarColor(state) {
        return state.snackbarColor;
    },
};
