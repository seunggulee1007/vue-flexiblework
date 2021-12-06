export default {
    toggleUserDialogFlag(state) {
        state.userDialog = !state.userDialog;
    },
    toggleDeptDialogFlag(state) {
        state.deptDialog = !state.deptDialog;
    },
    toggleNaviFlag(state, value) {
        state.naviFlag = value;
    },
    processStart(state) {
        state.process = true;
    },
    processStop(state) {
        state.process = false;
    },
    setProcessMsg(state, message) {
        state.processMsg = message;
    },
    setSanckbarMessage(state, message) {
        state.snackbarMessage = message;
    },
    setSnackbarTimeout(state, timeout) {
        state.snackbarTimeout = timeout;
    },
    startSnackbar(state) {
        state.snackbar = false;
    },
    endSnackbar(state) {
        state.snackbar = true;
    },
    setSnackbarColor(state, color) {
        state.snackbarColor = color;
    },
};
