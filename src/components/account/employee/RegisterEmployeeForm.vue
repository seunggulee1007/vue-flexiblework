<template>
    <main class="modal_container">
        <v-toolbar color="modal" dark flat>
            <v-toolbar-title class="pl-5">사원 등록</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-divider />
        <section class="modal_section">
            <v-form ref="form" v-model="valid" lazy-validation class="pa-10">
                <v-text-field
                    label="사원명"
                    :rules="[v => !!v || '사원명을 입력해주세요']"
                    v-model="employeeForm.userName"
                    prepend-icon="mdi-account"
                />
                <v-text-field
                    label="이메일"
                    type="text"
                    :rules="emailRules"
                    v-model="email"
                    clearable
                    prepend-icon="mdi-email"
                    :error-messages="emailDupErrorMessage"
                />
                <v-menu
                    v-model="datePickerShow"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            label="일사일"
                            prepend-icon="mdi-calendar"
                            v-model="employeeForm.hireDate"
                            readonly
                            :rules="[v => !!v || '입사일을 선택해 주세요']"
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        locale="ko"
                        v-model="employeeForm.hireDate"
                        @input="datePickerShow = false"
                    ></v-date-picker>
                </v-menu>
                <v-text-field label="사원번호" v-model="employeeForm.employeeCode" prepend-icon="mdi-counter" />
                <v-text-field
                    prepend-icon="mdi-folder-network"
                    v-model="employeeForm.departmentName"
                    :rules="[v => !!v || '부서를 선택해 주세요.']"
                    label="부서"
                    readonly
                    @click="searchDepartmentDialog = true"
                ></v-text-field>
                <v-dialog v-model="searchDepartmentDialog" max-width="600px" persistent>
                    <v-card v-if="searchDepartmentDialog">
                        <search-department-form
                            @close="closeSearchDepartmentModal"
                            @select="selectDepartment"
                        ></search-department-form>
                    </v-card>
                </v-dialog>
                <v-select
                    :items="positions"
                    prepend-icon="mdi-account-details"
                    item-text="title"
                    item-value="code"
                    v-model="employeeForm.position"
                    label="직급"
                />
            </v-form>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <confirm-dialog
                    btnColor="primary"
                    outlined
                    rounded
                    btnText="등록"
                    confirmDetailText="등록하시겠습니까?"
                    @success="validate"
                    depressed
                    :disabled="!valid"
                ></confirm-dialog>
                <v-btn color="cancel" depressed rounded outlined @click="close"> 취소 </v-btn>
            </v-card-actions>
        </section>
    </main>
</template>

<script>
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import SearchDepartmentForm from '@/components/account/department/SearchDepartmentDialog.vue';
import { getPositions } from '@/api/employee';
import { checkDupEmail, saveAccount } from '@/api/account';
export default {
    mounted() {
        this.getPositions();
    },
    components: {
        ConfirmDialog,
        SearchDepartmentForm,
    },
    data() {
        return {
            email: '',
            datePickerShow: false,
            searchDepartmentDialog: false,
            employeeForm: {
                position: '',
            },
            valid: false,
            emailRules: [
                v => !!v || '이메일을 입력해 주세요.',
                v => /.+@.+\..+/.test(v) || '이메일 형식이 유효하지 않습니다.',
            ],
            result: false,
            resultMsg: '',
            successResult: false,
            positions: [],
            emailDupErrorMessage: '',
        };
    },
    watch: {
        email() {
            this.emailDupErrorMessage = '';
        },
    },
    methods: {
        async validate() {
            if (this.$refs.form.validate()) {
                const email = this.email;
                if (await this.checkDupEmail(email)) {
                    this.emailDupErrorMessage = '이미 사용중인 이메일입니다.';
                    return false;
                } else {
                    this.emailDupErrorMessage = '';
                }

                this.employeeForm.email = email;
                let email1 = email.split('@')[0];
                const password = email1.length >= 9 ? email1.substr(0, 9) : email1;
                this.employeeForm.password =
                    password.length <= 5 ? `${password}2$z3%x4?c5&`.substr(0, 12) : `${password}2$z`;
                let res = await saveAccount(this.employeeForm);
                this.result = !res.success;
                this.resultMsg = res.message;
                if (res.success) {
                    this.successResult = true;
                    this.$emit('close');
                    this.$emit('save', [this.employeeForm.password]);
                }
            }
        },
        async checkDupEmail(email) {
            const res = await checkDupEmail(email);
            return res.response;
        },
        async getPositions() {
            let res = await getPositions();
            if (res.success) {
                this.positions = res.response;
                if (this.positions.length > 0) {
                    this.employeeForm.position = res.response[0].code;
                }
            }
        },
        close() {
            this.$emit('close');
        },
        closeSearchDepartmentModal() {
            this.searchDepartmentDialog = false;
        },
        selectDepartment(departments) {
            const department = departments[0];
            this.employeeForm.departmentId = department.departmentId;
            this.employeeForm.departmentName = department.departmentName;
        },
    },
};
</script>

<style></style>
