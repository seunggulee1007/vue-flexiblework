import { doAxios, doAxiosGet, doAxiosPost, doAxiosPut } from '../..';

function getCommuteGroupList(param) {
    return doAxios('/commute/group/list', 'get', param);
}
// 출퇴근 그룹 등록
function saveCommuteGroup(param) {
    return doAxiosPost('/commute/group', param);
}

// 출퇴근 그룹명 중복 확인
function confirmDuple(commuteGroupName) {
    return doAxiosGet(`/commute/group/confirm-duple/name/${commuteGroupName}`);
}

// 출퇴근 그룹 수정
function modifyCommuteGroup(param) {
    return doAxiosPut('/commute/group', param);
}

export { saveCommuteGroup, confirmDuple, modifyCommuteGroup, getCommuteGroupList };
