<template>
    <v-container class="fill-height">
        <v-row justify="center">
            <v-col cols="auto">
                <v-card width="550">
                    <v-card-text class="text-center px-12 py-16">
                        <div class="text-h4 font-weight-balck mb-10">회원가입</div>
                        <v-form ref="form" lazy-validation>
                            <v-text-field
                                label="이메일"
                                type="text"
                                :rules="emailRules"
                                v-model="signUpForm.email"
                                clearable
                                prepend-icon="mdi-email"
                                @keyup.enter="validate"
                            />
                            <v-text-field
                                label="사원명"
                                :rules="[v => !!v || '사원명을 입력해주세요']"
                                v-model="signUpForm.userName"
                                prepend-icon="mdi-account"
                            />
                            <v-text-field
                                label="사원번호"
                                v-model="signUpForm.employeeCode"
                                prepend-icon="mdi-counter"
                            />
                            <v-select
                                :items="positions"
                                prepend-icon="mdi-account-details"
                                item-text="title"
                                item-value="code"
                                v-model="signUpForm.position"
                                label="직급"
                            />
                            <v-text-field
                                label="비밀번호"
                                type="password"
                                clearable
                                v-model="signUpForm.password"
                                :rules="passwordRules"
                                prepend-icon="mdi-lock-outline"
                                @keyup.enter="validate"
                            />
                            <v-text-field
                                label="비밀번호 확인"
                                type="password"
                                clearable
                                v-model="confirmPassword"
                                :rules="confirmPasswordRules"
                                prepend-icon="mdi-lock-outline"
                                @keyup.enter="validate"
                            />
                            <v-btn
                                :disabled="!valid"
                                block
                                x-large
                                rounded
                                color="warning"
                                class="mt-10"
                                @click="validate"
                                >회원가입</v-btn
                            >
                        </v-form>
                    </v-card-text>
                    <v-alert class="mt-10" type="error" v-model="result" text dense outlined dismissible>{{
                        resultMsg
                    }}</v-alert>
                    <v-alert class="mt-10" type="success" v-model="successResult" text dense outlined dismissible>{{
                        resultMsg
                    }}</v-alert>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { signUp } from '@/api/auth';
import { getPositions } from '@/api/employee';
export default {
    mounted() {
        this.getPositions();
    },
    data() {
        return {
            signUpForm: {
                position: '',
            },
            valid: true,
            confirmPassword: '',
            emailRules: [
                v => !!v || '이메일을 입력해 주세요.',
                v => /.+@.+\..+/.test(v) || '이메일 형식이 유효하지 않습니다.',
            ],
            passwordRules: [
                v => !!v || '비밀번호를 입력해 주세요.',
                v => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,12}$/.test(v) || '숫자와 영문자, 특수 문자 조합으로 8~12자리를 사용해야 합니다.', /* eslint-disable-line */
            ],
            confirmPasswordRules: [
                v => !!v || '비밀번호를 입력해 주세요.',
                v => v === this.signUpForm.password || '비밀번호가 일치하지 않습니다.',
            ],
            result: false,
            resultMsg: '',
            successResult: false,
            positions: [],
        };
    },
    methods: {
        async validate() {
            if (this.$refs.form.validate()) {
                let res = await signUp(this.signUpForm);
                this.result = !res.success;
                this.resultMsg = res.message;
                if (res.success) {
                    this.successResult = true;
                    setTimeout(() => {
                        this.$router.push('/');
                    }, 2000);
                }
            }
        },
        async getPositions() {
            let res = await getPositions();
            console.log(res);
            if (res.success) {
                this.positions = res.response;
                if (this.positions.length > 0) {
                    this.signUpForm.position = res.response[0].code;
                }
            }
        },
    },
};
</script>

<style></style>
