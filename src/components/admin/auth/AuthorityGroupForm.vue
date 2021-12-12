<template>
    <main class="modal_main">
        <v-toolbar color="modal" dark flat>
            <v-toolbar-title class="pl-5">권한그룹 등록</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <section class="modal_section">
            <v-card>
                <v-form v-model="valid" ref="authorigyGroup" lazy-validation class="pa-10">
                    <v-row>
                        <v-col cols="10">
                            <v-text-field
                                v-model="authorityGroupName"
                                label="그룹명"
                                :rules="[
                                    v => !!v || '그룹명을 입력해 주세요',
                                    (!originGroupName && confirmDupleResult) ||
                                        (originGroupName == authorityGroupName && !confirmDupleResult) ||
                                        '중복체크를 진행해 주세요.',
                                    serverDupleResult || '이미 등록된 그룹명입니다. 다른 그룹명을 입력해 주세요.',
                                ]"
                                :disabled="serverDupleResult"
                            />
                        </v-col>
                        <v-col cols="2">
                            <v-btn
                                class="mt-3"
                                color="primary"
                                outlined
                                :disabled="
                                    (!originGroupName && confirmDupleResult) ||
                                    (originGroupName == authorityGroupName && !confirmDupleResult)
                                "
                                @click="confirmDupleName"
                                v-if="!serverDupleResult"
                                >중복확인</v-btn
                            >
                            <v-btn class="mt-3" color="primary" outlined v-else @click="reSearch"> 재조회 </v-btn>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="12" md="4">
                            <v-switch v-model="authorityGroup.basic" label="기본적용여부"> </v-switch>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-switch v-model="authorityGroup.active" label="사용여부"></v-switch>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-switch v-model="authorityGroup.admin" label="관리자여부"></v-switch>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="text-right">
                            <v-dialog v-model="empDialog" max-width="1300px">
                                <template v-slot:activator="{}">
                                    <v-btn color="primary" outlined class="mb-2" small @click="openEmployeeModal">
                                        사원 등록
                                    </v-btn>
                                </template>
                                <v-card v-if="empDialog">
                                    <search-employee-form
                                        searchKind="1"
                                        @close="closeEmpDialog"
                                        @success="success"
                                    ></search-employee-form>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-data-table
                                :headers="headers"
                                :items="employeeList"
                                item-key="employeeId"
                                hide-default-footer
                                class="elevation-1"
                            >
                                <template v-slot:item.actions="{ item }">
                                    <v-icon small @click="deleteEmployee(item)"> mdi-delete </v-icon>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-form>
                <v-divider />
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <confirm-dialog
                        :btnColor="'primary'"
                        :outlined="true"
                        :rounded="true"
                        :btnText="btnText"
                        :confirmDetailText="confirmText"
                        @success="saveGroup"
                        :depressed="true"
                        :disabled="!valid"
                    ></confirm-dialog>
                    <v-btn color="cancel" depressed rounded outlined @click="close"> 취소 </v-btn>
                </v-card-actions>
            </v-card>
        </section>
    </main>
</template>

<script>
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import SearchEmployeeForm from '@/components/account/SearchEmployeeForm.vue';
import { confirmDuple, saveAuthorityGroup } from '@/api/admin/authorityGroup';
export default {
    created() {
        this.authorityGroup = this.deepCopy(this.originAuthorityGroup);
        this.originGroupName = this.originAuthorityGroup.authorityGroupName;
    },
    props: ['originAuthorityGroup'],
    components: {
        ConfirmDialog,
        SearchEmployeeForm,
    },
    watch: {
        authorityGroupName() {
            this.confirmDupleResult = false;
        },
    },
    data() {
        return {
            valid: false,
            btnText: '등록',
            confirmText: '등록하시겠습니까?',
            confirmDupleResult: false,
            authorityGroup: {},
            serverDupleResult: false,
            originGroupName: '',
            authorityGroupName: '',
            empDialog: false,
            selected: [],
            headers: [
                {
                    text: '사원번호',
                    align: 'center',
                    sortable: false,
                    value: 'employeeId',
                },
                {
                    text: '사원명',
                    align: 'center',
                    sortable: false,
                    value: 'userName',
                },
                {
                    text: '이메일',
                    align: 'center',
                    sortable: false,
                    value: 'email',
                },
                {
                    text: '삭제',
                    align: 'center',
                    sortable: false,
                    value: 'actions',
                },
            ],
            employeeList: [],
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async saveGroup() {
            let flag = false;
            this.authorityGroup.authorityGroupName = this.authorityGroupName;
            let accountIdList = [];
            for (let employee of this.employeeList) {
                accountIdList.push(employee.accountId);
            }
            this.authorityGroup.accountIdList = accountIdList;
            if (this.$refs.authorigyGroup.validate()) {
                if (this.authorityGroup.authorityGroupId) {
                    // TODO 수정 로직
                } else {
                    // TODO 등록 로직
                    let res = await saveAuthorityGroup(this.authorityGroup);
                    if (res.success) {
                        flag = true;
                    }
                }
                if (flag) {
                    this.$emit('success');
                }
            }
        },
        async confirmDupleName() {
            let res = await confirmDuple(this.authorityGroupName);
            console.log(res);
            if (res.success) {
                this.confirmDupleResult = !res.response;
                this.serverDupleResult = !res.response;
            }
        },
        closeEmpDialog() {
            this.empDialog = false;
        },
        success(items) {
            for (let account of items) {
                if (!this.checkRetain(account.accountId)) {
                    this.employeeList.push(account);
                }
            }
            this.closeEmpDialog();
        },
        openEmployeeModal() {
            this.empDialog = true;
        },
        checkRetain(accountId) {
            for (let account of this.employeeList) {
                if (account.accountId == accountId) {
                    return true;
                }
            }
            return false;
        },
        deleteEmployee(employee) {
            let idx = this.employeeList.indexOf(employee);
            this.employeeList.splice(idx, 1);
        },
        reSearch() {
            this.confirmDupleResult = false;
            this.serverDupleResult = false;
        },
    },
};
</script>

<style></style>
