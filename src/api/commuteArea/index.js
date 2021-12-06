import { doAxiosPost, doAxiosPut, doAxios, doAxiosGet } from '../index';

const baseUrl = '/commute/area';

// 출퇴근 허용지역 등록
function saveCommuteArea(param) {
    return doAxiosPost(baseUrl, param);
}

// 출퇴근 허용 지역 수정
function modifyCommuteArea(param) {
    return doAxiosPut(baseUrl, param);
}

// 출퇴근 허용 지역 단건 조회
function getCommuteArea(commuteareaId) {
    return doAxiosGet(`${baseUrl}/id/${commuteareaId}`);
}

// 출퇴근 허용지역 리스트 조회
function getCommuteAreaList(param) {
    return doAxios(`${baseUrl}/list`, 'get', param);
}

export { saveCommuteArea, modifyCommuteArea, getCommuteAreaList, getCommuteArea };
