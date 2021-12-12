<template>
    <main class="modal_main">
        <v-toolbar color="modal" dark flat>
            <v-toolbar-title class="pl-5"><v-icon large>mdi-map-legend</v-icon>출퇴근 허용지역 등록</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-divider />
        <section class="modal_section">
            <v-card class="pa-5 container_card"
                ><v-form v-model="valid" ref="authorigyGroup" lazy-validation class="pa-10">
                    <v-row>
                        <v-col cols="10">
                            <v-text-field
                                v-model="commuteGroupName"
                                label="그룹명"
                                :rules="[
                                    v => !!v || '그룹명을 입력해 주세요',
                                    (!originGroupName && confirmDupleResult) ||
                                        (originGroupName == commuteGroupName && !confirmDupleResult) ||
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
                                    (originGroupName == commuteGroupName && !confirmDupleResult)
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
                            <v-switch v-model="commuteGroup.active" label="사용여부"></v-switch>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-tabs v-model="tab" icons-and-text>
                                <v-tab href="#tab-1">
                                    부서
                                    <v-icon>mdi-table</v-icon>
                                </v-tab>

                                <v-tab href="#tab-2">
                                    사원
                                    <v-icon>mdi-format-list-numbered</v-icon>
                                </v-tab>
                            </v-tabs>
                            <v-tabs-items v-model="tab" :dark="isDark">
                                <v-tab-item value="tab-1"
                                    ><v-row>
                                        <v-col class="text-right">
                                            <v-dialog v-model="departmentDialog" width="500">
                                                <template v-slot:activator="{}">
                                                    <v-btn
                                                        color="primary"
                                                        outlined
                                                        class="mb-2"
                                                        small
                                                        @click="openDepartmentModal"
                                                    >
                                                        부서 등록
                                                    </v-btn>
                                                </template>
                                                <v-card>
                                                    <search-department-form
                                                        @close="closeSearchDepartmentModal"
                                                        @select="departmentSuccess"
                                                        multi
                                                        searchKind="1"
                                                    >
                                                    </search-department-form>
                                                </v-card>
                                            </v-dialog>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-data-table
                                                :headers="headers2"
                                                :items="departmentList"
                                                item-key="departmentId"
                                                hide-default-footer
                                                class="elevation-1"
                                            >
                                                <template v-slot:item.actions="{ item }">
                                                    <v-icon small @click="deleteDepartment(item)"> mdi-delete </v-icon>
                                                </template>
                                            </v-data-table>
                                        </v-col>
                                    </v-row>
                                </v-tab-item>
                                <v-tab-item value="tab-2">
                                    <v-row>
                                        <v-col class="text-right">
                                            <v-dialog v-model="empDialog" max-width="1300px">
                                                <template v-slot:activator="{}">
                                                    <v-btn
                                                        color="primary"
                                                        outlined
                                                        class="mb-2"
                                                        small
                                                        @click="openEmployeeModal"
                                                    >
                                                        사원 등록
                                                    </v-btn>
                                                </template>
                                                <v-card v-if="empDialog">
                                                    <search-employee-form
                                                        searchKind="1"
                                                        @close="closeEmpDialog"
                                                        @success="employeeSuccess"
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
                                </v-tab-item>
                            </v-tabs-items>
                        </v-col>
                    </v-row>
                </v-form>
                <v-divider />
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <confirm-dialog
                        btnColor="primary"
                        outlined
                        rounded
                        btnText="저장"
                        confirmDetailText="저장하시겠습니까?"
                        @success="saveGroup"
                        depressed
                        :disabled="!valid"
                    ></confirm-dialog>
                    <v-btn color="cancel" depressed rounded outlined @click="close"> 취소 </v-btn>
                </v-card-actions></v-card
            >
        </section>
    </main>
</template>

<script>
import { mapGetters } from 'vuex';
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import SearchEmployeeForm from '@/components/account/employee/SearchEmployeeDialog.vue';
import { saveCommuteGroup, confirmDuple } from '@/api/commute/commuteGroup';
import SearchDepartmentForm from '@/components/account/department/SearchDepartmentDialog.vue';
export default {
    components: {
        ConfirmDialog,
        SearchEmployeeForm,
        SearchDepartmentForm,
    },
    computed: {
        ...mapGetters(['isDark']),
    },
    data() {
        return {
            commuteGroup: {},
            commuteGroupName: '',
            originGroupName: '',
            empDialog: false,
            departmentDialog: false,
            valid: false,
            tab: null,
            confirmDupleResult: false,
            serverDupleResult: false,
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
            headers2: [
                {
                    text: '부서번호',
                    align: 'center',
                    sortable: false,
                    value: 'departmentId',
                },
                {
                    text: '부서명',
                    align: 'center',
                    sortable: false,
                    value: 'departmentName',
                },
                {
                    text: '부서원 수',
                    align: 'center',
                    sortable: false,
                    value: 'groupNumber',
                },
                {
                    text: '삭제',
                    align: 'center',
                    sortable: false,
                    value: 'actions',
                },
            ],
            employeeList: [],
            departmentList: [],
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async saveGroup() {
            let flag = false;
            this.commuteGroup.authorityGroupName = this.authorityGroupName;
            let accountIdList = [];
            for (let employee of this.employeeList) {
                accountIdList.push(employee.accountId);
            }
            this.commuteGroup.accountIdList = accountIdList;
            if (this.$refs.commuteGroup.validate()) {
                if (this.commuteGroup.authorityGroupId) {
                    // TODO 수정 로직
                } else {
                    // TODO 등록 로직
                    let res = await saveCommuteGroup(this.commuteGroup);
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
            let res = await confirmDuple(this.commuteGroupName);
            if (res.success) {
                this.confirmDupleResult = !res.response;
                this.serverDupleResult = !res.response;
            }
        },
        closeEmpDialog() {
            this.empDialog = false;
        },
        // 사원 모달 전달값 회신
        employeeSuccess(items) {
            for (let account of items) {
                if (!this.checkRetain(account.accountId)) {
                    this.employeeList.push(account);
                }
            }
            this.closeEmpDialog();
        },
        // 사원 모달 오픈
        openEmployeeModal() {
            this.empDialog = true;
        },
        // 부서 모달 오픈
        openDepartmentModal() {
            this.departmentDialog = true;
        },
        // 부서 모달 닫기
        closeSearchDepartmentModal() {
            console.log('뭐야 이거 안타?');
            this.departmentDialog = false;
        },
        // 사원 중복 체크
        checkRetain(accountId) {
            for (let account of this.employeeList) {
                if (account.accountId == accountId) {
                    return true;
                }
            }
            return false;
        },
        // 부서 모달 전달 값 회신
        departmentSuccess(items) {
            for (let department of items) {
                if (!this.checkRetainDepartment(department.departmentId)) {
                    this.departmentList.push(department);
                }
            }
            this.closeSearchDepartmentModal();
        },
        checkRetainDepartment(departmentId) {
            for (let department of this.departmentList) {
                if (department.departmentId == departmentId) {
                    return true;
                }
            }
            return false;
        },
        deleteEmployee(employee) {
            let idx = this.employeeList.indexOf(employee);
            this.employeeList.splice(idx, 1);
        },
        deleteDepartment(department) {
            let idx = this.departmentList.indexOf(department);
            this.departmentList.splice(idx, 1);
        },
        reSearch() {
            this.confirmDupleResult = false;
            this.serverDupleResult = false;
        },
    },
};
</script>

<style></style>
