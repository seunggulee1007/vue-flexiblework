export default {
    toggleUserDialogFlag(state) {
        state.userDialog = !state.userDialog;
    },
    toggleDeptDialogFlag(state) {
        state.deptDialog = !state.deptDialog;
    },
    toggleNaviFlag(state) {
        state.naviFlag = !state.naviFlag;
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
};
