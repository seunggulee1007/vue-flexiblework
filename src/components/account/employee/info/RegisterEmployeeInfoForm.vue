<template>
    <v-container fluid class="px-6">
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
                <v-col cols="4">
                    <v-subheader>이메일</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-text-field label="" v-model="newAccount.email" readonly flat solo></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="4">
                    <v-subheader>사원명</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-text-field
                        label="사원명"
                        :rules="[v => !!v || '사원명을 입력해주세요']"
                        v-model="newAccount.userName"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="4">
                    <v-subheader>부서</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-text-field
                        v-model="newAccount.departmentName"
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
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="4">
                    <v-subheader>적용여부</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-switch v-model="newAccount.rightNow" label="즉시 등록 여부" style="margin-top: 6px"></v-switch>
                </v-col>
            </v-row>

            <v-row v-if="!newAccount.rightNow">
                <v-col cols="4">
                    <v-subheader>적용일자</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-row>
                        <v-col cols="12">
                            <v-menu
                                v-model="newAccount.pickerOn"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="newAccount.applyDate"
                                        label="적용날짜"
                                        readonly
                                        :rules="[v => (!!v && !newAccount.rightNow) || '적용 날짜를 선택해 주세요']"
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    :min="new Date().toISOString().substr(0, 10)"
                                    locale="ko"
                                    v-model="newAccount.applyDate"
                                    @input="newAccount.pickerOn = false"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="4">
                    <v-subheader>직급</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-select
                        :items="positions"
                        item-text="title"
                        item-value="code"
                        v-model="newAccount.position"
                        label="직급"
                    />
                </v-col>
            </v-row>
            <v-card-actions>
                <v-spacer></v-spacer>
                <confirm-dialog
                    :btnColor="'primary'"
                    :outlined="true"
                    :rounded="true"
                    btnText="수정"
                    confirmDetailText="수정하시겠습니까?"
                    @success="validate"
                    :depressed="true"
                    :disabled="!valid"
                ></confirm-dialog>
                <v-btn color="cancel" depressed rounded outlined @click="closeEditable"> 취소 </v-btn>
            </v-card-actions>
        </v-form>
    </v-container>
</template>

<script>
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import SearchDepartmentForm from '@/components/account/department/SearchDepartmentDialog.vue';
import { getPositions } from '@/api/employee';
import { updateAccount } from '@/api/account';
export default {
    props: ['account'],
    created() {
        this.newAccount = this.deepCopy(this.account);
        this.getPositions(this.account.position);
    },
    components: {
        ConfirmDialog,
        SearchDepartmentForm,
    },
    data() {
        return {
            newAccount: {
                position: '',
            },
            searchDepartmentDialog: false,
            valid: false,
            result: false,
            resultMsg: '',
            successResult: false,
            positions: [],
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
                this.newAccount.originalDepartmentId = this.account.departmentId;
                let res = await updateAccount(this.newAccount);
                this.result = !res.success;
                this.resultMsg = res.message;
                if (res.success) {
                    this.successResult = true;
                    this.$emit('close');
                }
            }
        },
        async getPositions(title) {
            let res = await getPositions();
            if (res.success) {
                this.positions = res.response;

                let selectedPosition;
                if (title && this.positions.length > 0) {
                    selectedPosition = res.response.filter(position => {
                        return title === position.title;
                    });
                } else {
                    selectedPosition = res.response;
                }
                this.newAccount.position = selectedPosition[0].code;
            }
        },
        closeEditable() {
            this.newAccount = this.deepCopy(this.account);
            this.$emit('closeEditable');
        },
        closeSearchDepartmentModal() {
            this.searchDepartmentDialog = false;
        },
        selectDepartment(departments) {
            const department = departments[0];
            this.newAccount.departmentId = department.departmentId;
            this.newAccount.departmentName = department.departmentName;
        },
    },
};
</script>

<style></style>
