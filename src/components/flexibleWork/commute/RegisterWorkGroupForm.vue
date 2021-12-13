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
                ><v-form v-model="valid" ref="commuteGroup" lazy-validation class="pa-10">
                    <v-row>
                        <v-col cols="10">
                            <v-text-field
                                v-model="groupName"
                                label="그룹명"
                                :rules="[
                                    v => !!v || '그룹명을 입력해 주세요',
                                    (!originGroupName && confirmDupleResult) ||
                                        (originGroupName == groupName && !confirmDupleResult) ||
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
                                    (originGroupName == groupName && !confirmDupleResult)
                                "
                                @click="confirmDupleName"
                                v-if="!serverDupleResult"
                                >중복확인</v-btn
                            >
                            <v-btn class="mt-3" color="primary" outlined v-else @click="reSearch"> 재조회 </v-btn>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-text-field
                                append-icon="mdi-magnify"
                                label="유연근무 유형 선택"
                                v-model="commuteGroup.flexibleWorkName"
                                readonly
                                @click:append="openFlexibleWorkModal"
                            />
                            <v-dialog v-model="flexibleWorkModal" max-width="1200px">
                                <v-card>
                                    <choice-flexible-work
                                        v-if="flexibleWorkModal"
                                        @selectFlexibleWork="selectFlexibleWork"
                                        @close="closeFlexibleWorkModal"
                                    ></choice-flexible-work>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-text-field
                                append-icon="mdi-magnify"
                                label="출퇴근 허용 지역 선택"
                                v-model="commuteGroup.areaName"
                                readonly
                                @click:append="openCommuteAreaModal"
                            />
                            <v-dialog v-model="commuteAreaModal" max-width="1200px">
                                <v-card>
                                    <choice-commute-area
                                        v-if="commuteAreaModal"
                                        @selectCommuteArea="selectCommuteArea"
                                        @close="closeCommuteAreaModal"
                                    ></choice-commute-area>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-switch v-model="commuteGroup.active" label="사용여부"></v-switch>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
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
                                        height="400"
                                    >
                                        <template v-slot:item.actions="{ item }">
                                            <v-icon small @click="deleteEmployee(item)"> mdi-delete </v-icon>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
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
import ChoiceFlexibleWork from '@/components/flexibleWork/workType/ChoiceFlexibleWork.vue';
import ChoiceCommuteArea from '@/components/flexibleWork/commute/ChoiceWorkArea.vue';
import { saveCommuteGroup, confirmDuple } from '@/api/commute/commuteGroup';
export default {
    components: {
        ConfirmDialog,
        SearchEmployeeForm,
        ChoiceFlexibleWork,
        ChoiceCommuteArea,
    },
    computed: {
        ...mapGetters(['isDark']),
    },
    data() {
        return {
            commuteGroup: {
                active: true,
            },
            groupName: '',
            originGroupName: '',
            empDialog: false,
            valid: false,
            tab: null,
            confirmDupleResult: false, // 중복확인 체크 결과
            serverDupleResult: false, // 중복 확인 서버 결과
            flexibleWorkModal: false, // 유연근무 유형 모달
            commuteAreaModal: false, // 출퇴근 허용지역 모달
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
            this.commuteGroup.groupName = this.groupName;
            let accountIdList = [];
            for (let employee of this.employeeList) {
                accountIdList.push(employee.accountId);
            }
            this.commuteGroup.accountIdList = accountIdList;
            if (this.$refs.commuteGroup.validate()) {
                if (this.commuteGroup.commuteGroupId) {
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
        openFlexibleWorkModal() {
            this.flexibleWorkModal = true;
        },
        closeFlexibleWorkModal() {
            this.flexibleWorkModal = false;
        },
        selectFlexibleWork(item) {
            this.commuteGroup.flexibleWorkId = item.flexibleWorkId;
            this.commuteGroup.flexibleWorkName = item.flexibleWorkName;
            this.closeFlexibleWorkModal();
        },
        openCommuteAreaModal() {
            this.commuteAreaModal = true;
        },
        closeCommuteAreaModal() {
            this.commuteAreaModal = false;
        },
        selectCommuteArea(item) {
            this.commuteGroup.commuteAreaId = item.commuteAreaId;
            this.commuteGroup.areaName = item.areaName;
            this.closeCommuteAreaModal();
        },
        async confirmDupleName() {
            let res = await confirmDuple(this.groupName);
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

        // 사원 중복 체크
        checkRetain(accountId) {
            for (let account of this.employeeList) {
                if (account.accountId == accountId) {
                    return true;
                }
            }
            return false;
        },

        reSearch() {
            this.confirmDupleResult = false;
            this.serverDupleResult = false;
        },
    },
};
</script>

<style></style>
