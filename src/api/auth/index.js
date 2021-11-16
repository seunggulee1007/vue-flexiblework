import { doAxiosGet, doAxiosPost, doAxiosPut } from '../index';

// 로그인
function signIn(data) {
    return doAxiosPost('/sign-in', data);
}

// 회원가입
function signUp(data) {
    return doAxiosPost('/account/sign-up', data);
}

// 토큰 값 인증
function checkEmailToken(token, email) {
    return doAxiosGet(`/account/check-email-token/${token}/${email}`);
}

// 프로필 이미지 변경
function changeProfileImage(param) {
    return doAxiosPut('/settings/profileImage', param);
}

// 비밀번호 변경
function changePassword(param) {
    return doAxiosPut('/settings/password', param);
}

export { signIn, signUp, checkEmailToken, changeProfileImage, changePassword };
