<template>
    <v-container class="fill-height">
        <v-row justify="center">
            <v-col cols="auto">
                <v-card width="460">
                    <v-card-text class="text-center px-12 py-16">
                        <div class="text-h4 font-weight-balck mb-10">로그인</div>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field
                                label="이메일"
                                type="text"
                                :rules="emailRules"
                                v-model="email"
                                clearable
                                ref="email"
                                prepend-icon="mdi-email"
                                @keyup.enter="validate"
                            ></v-text-field>
                            <v-text-field
                                label="비밀번호"
                                type="password"
                                clearable
                                v-model="password"
                                :rules="[v => !!v || '비밀번호를 입력해 주세요']"
                                prepend-icon="mdi-lock-outline"
                                @keyup.enter="validate"
                            ></v-text-field>
                            <v-btn
                                :disabled="!valid"
                                block
                                x-large
                                rounded
                                color="primary"
                                class="mt-10"
                                @click="validate"
                                >로그인</v-btn
                            >
                        </v-form>
                        <v-alert class="mt-10" type="error" v-model="result" text dense outlined dismissible>{{
                            resultMsg
                        }}</v-alert>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    mounted() {
        this.$refs.email.focus();
    },
    name: 'signIn',
    data() {
        return {
            userName: '',
            email: '',
            password: '',
            valid: true,
            emailRules: [
                v => !!v || '이메일을 입력해 주세요.',
                v => /.+@.+\..+/.test(v) || '이메일 형식이 유효하지 않습니다.',
            ],
            result: false,
            resultMsg: '',
        };
    },
    methods: {
        ...mapActions(['LOGIN']),
        async validate() {
            if (this.$refs.form.validate()) {
                const param = {
                    email: this.email,
                    password: this.password,
                };
                let res = await this.LOGIN(param);
                this.result = !res.success;
                if (!res.success) {
                    this.resultMsg = res.message;
                } else {
                    this.$router.push('/');
                }
            }
        },
    },
};
</script>

<style></style>
