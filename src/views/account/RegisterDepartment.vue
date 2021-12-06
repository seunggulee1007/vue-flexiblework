<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-briefcase-account</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="container_card" elevation="0">
            <v-row>
                <v-col cols="12" md="6">
                    <v-container>
                        <v-card-title>부서 검색</v-card-title>
                        <v-divider></v-divider>
                        <v-card class="mx-auto mt-5" max-width="500">
                            <v-sheet class="pa-4 primary lighten-2">
                                <v-text-field
                                    v-model="search"
                                    label="Search Company Directory"
                                    open-on-click
                                    activatable
                                    dark
                                    flat
                                    hide-details
                                    clearable
                                    clear-icon="mdi-close-circle-outline"
                                ></v-text-field>
                            </v-sheet>
                            <v-card-text>
                                <v-treeview
                                    :items="items"
                                    :search="search"
                                    :filter="filter"
                                    :open.sync="open"
                                    item-text="departmentName"
                                    item-key="departmentId"
                                    color="warning"
                                    open-on-click
                                    transition
                                    item-children="children"
                                >
                                    <template v-slot:prepend="{ item }" @click="selectDepartment(item)">
                                        <v-icon
                                            v-if="item.children.length > 0"
                                            v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
                                        ></v-icon>
                                    </template>
                                    <template v-slot:append="{ item }">
                                        <v-btn @click="selectItem(item, $event)" small color="warning"
                                            >선택</v-btn
                                        ></template
                                    >
                                </v-treeview>
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-col>
                <v-divider vertical></v-divider>

                <v-col cols="12" md="5" class="d-flex text-center">
                    <v-scroll-y-transition mode="out-in">
                        <v-container v-if="!selected.departmentName">
                            <div>부서를 선택해 주세요</div>
                        </v-container>
                        <v-container v-else>
                            <v-card-title>{{ selected.departmentName }}</v-card-title>
                            <v-divider />
                            <v-form v-model="valid" lazy-validation ref="form" class="my-5">
                                <v-text-field
                                    v-model="selected.departmentName"
                                    :rules="[v => !!v || '부서명을 입력해 주세요.']"
                                    readonly
                                    label="부서명"
                                />
                                <v-text-field label="부서erp코드" readonly v-model="selected.departmentCode" />
                            </v-form>
                            <v-divider />
                            <v-expansion-panels v-model="panel" multiple>
                                <v-expansion-panel>
                                    <v-expansion-panel-header>하위 부서 목록</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-card-actions class="justify-end">
                                            <v-dialog v-model="dialog" max-width="700px" persistent>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn
                                                        color="primary"
                                                        dark
                                                        class="mb-2"
                                                        small
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    >
                                                        신규부서 등록
                                                    </v-btn>
                                                </template>
                                                <v-card v-if="dialog">
                                                    <register-department-form
                                                        :department="department"
                                                        :selected="selected"
                                                        @close="close"
                                                        @success="success"
                                                    ></register-department-form>
                                                </v-card>
                                            </v-dialog>
                                        </v-card-actions>
                                        <v-data-table
                                            :headers="headers"
                                            :items="selected.children"
                                            hide-default-footer
                                            class="elevation-1"
                                        >
                                            <template v-slot:item.actions="{ item }">
                                                <v-icon small class="mr-2" @click="editDepartment(item)">
                                                    mdi-pencil
                                                </v-icon>
                                                <!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
                                            </template>
                                        </v-data-table>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                                <v-expansion-panel class="mb-10">
                                    <v-expansion-panel-header>소속 사원</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-card-actions class="justify-end">
                                            <v-dialog v-model="empDialog" max-width="800px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn
                                                        color="primary"
                                                        dark
                                                        class="mb-2"
                                                        small
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    >
                                                        사원 등록
                                                    </v-btn>
                                                </template>
                                                <v-card v-if="empDialog">
                                                    <search-employee-form
                                                        :selected="selected"
                                                        @close="closeEmpDialog"
                                                        @success="success"
                                                    ></search-employee-form>
                                                </v-card>
                                            </v-dialog>
                                        </v-card-actions>
                                        <v-data-table
                                            :headers="empHeaders"
                                            :items="selected.employeeDtoList"
                                            hide-default-footer
                                            class="elevation-1"
                                        >
                                        </v-data-table>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-container>
                    </v-scroll-y-transition>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { getDepartmentList } from '@/api/account';
import RegisterDepartmentForm from '@/components/account/RegisterDepartmentForm.vue';
import SearchEmployeeForm from '@/components/account/SearchEmployeeForm.vue';
export default {
    created() {
        this.getDepartmentList();
    },
    components: {
        RegisterDepartmentForm,
        SearchEmployeeForm,
    },
    data: () => ({
        items: [],
        search: null,
        open: [],
        caseSensitive: false,
        valid: false,
        department: {
            departmentId: 0,
            departmentName: '',
            departmentCode: '',
            pickerOn: false,
            rightNow: false,
            active: false,
        },
        defaultDepartment: {
            departmentId: 0,
            departmentName: '',
            departmentCode: '',
            pickerOn: false,
            rightNow: false,
            active: false,
        },
        dialog: false,
        empDialog: false,
        successFlag: false,
        resultMsg: '',
        active: [],
        headers: [
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
                text: 'erp부서코드',
                align: 'center',
                sortable: false,
                value: 'departmentCode',
            },
            {
                text: '비고',
                align: 'center',
                value: 'actions',
                sortable: false,
            },
        ],
        empHeaders: [
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
        ],
        selected: {},
        panel: [0],
    }),
    computed: {
        filter() {
            return undefined;
        },
    },
    methods: {
        selectItem(item, e) {
            e.stopPropagation();
            this.selected = item;
        },
        async getDepartmentList() {
            let res = await getDepartmentList();
            if (res.success) {
                this.items = res.response;
            }
        },
        selectDepartment(item) {
            this.department = item;
        },
        // 부서 등록 폼 초기화
        clearDepartment() {
            this.department = Object.assign({}, this.defaultDepartment);
        },
        // 부서 등록 창 닫기
        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.department = Object.assign({}, this.defaultDepartment);
            });
        },
        // 사원 등록 창 닫기
        closeEmpDialog() {
            this.empDialog = false;
        },
        success() {
            this.getDepartmentList();
            this.close();
        },
        // 부서 수정 모달
        editDepartment(item) {
            this.department = item;
            this.dialog = true;
        },
    },
};
</script>

<style></style>
