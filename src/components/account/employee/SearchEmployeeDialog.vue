<template>
    <main class="modal_main">
        <v-toolbar color="modal" dark flat>
            <v-toolbar-title class="pl-5"> <v-icon>mdi-account-plus-outline</v-icon> 사원 등록</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-divider />
        <section class="modal_section pa-7">
            <v-card>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-card class="mx-auto px-2 overflow-auto" max-width="600" min-height="500" max-height="600">
                            <v-card-title>부서 검색</v-card-title>
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
                                    item-text="departmentName"
                                    item-key="departmentId"
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
                                        <v-btn @click="selectItem(item, $event)" small color="secondary" outlined
                                            >선택</v-btn
                                        ></template
                                    >
                                </v-treeview>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card min-height="500" max-height="600" class="px-2">
                            <v-card-title> 사원명 </v-card-title>
                            <v-data-table
                                v-model="selectedItems"
                                :headers="headers"
                                :items="employeeList"
                                item-key="employeeId"
                                :loading="loading"
                                show-select
                                class="elevation-0"
                                height="350"
                                hide-default-footer
                            ></v-data-table>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card min-height="500" max-height="600" class="px-2">
                            <v-data-table
                                :headers="selectedHeaders"
                                :items="selectedItems"
                                class="elevation-0"
                                height="500"
                                hide-default-footer
                            >
                                <template v-slot:top>
                                    <v-toolbar flat>
                                        <v-toolbar-title>선택한 항목</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                    </v-toolbar>
                                </template>
                                <template v-slot:item.actions="{ item }">
                                    <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
                <v-divider />
                <v-card-actions class="mt-3">
                    <v-spacer></v-spacer>
                    <confirm-dialog
                        btnColor="primary"
                        :outlined="true"
                        :rounded="true"
                        btnText="등록"
                        confirmDetailText="등록하시겠습니까?"
                        @success="saveEmployeeDepartment"
                        btnSize="large"
                        depressed
                    ></confirm-dialog>
                    <v-btn color="cancel" large depressed rounded outlined @click="close"> 취소 </v-btn>
                </v-card-actions>
            </v-card>
        </section>
    </main>
</template>

<script>
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import { getDepartmentList } from '@/api/account';
import { getEmployeeList } from '@/api/employee';
export default {
    mounted() {
        this.getDepartmentList();
    },
    props: ['searchKind'],
    components: {
        ConfirmDialog,
    },
    data() {
        return {
            search: '',
            totalItems: 0,
            items: [],
            employeeList: [],
            loading: false,
            selectedItems: [],
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
            ],
            selectedHeaders: [
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
        };
    },
    computed: {
        filter() {
            return undefined;
        },
    },
    methods: {
        async getDepartmentList() {
            let res = await getDepartmentList();
            if (res.success) {
                this.items = res.response;
            }
        },
        async getEmployeeList(departmentId) {
            this.loading = true;
            const param = {
                departmentId,
                commuteGroup: this.searchKind == 1,
            };
            let res = await getEmployeeList(param);
            if (res.success) {
                this.employeeList = res.response;
            }
            this.loading = false;
        },
        selectItem(item, e) {
            e.stopPropagation();
            this.getEmployeeList(item.departmentId);
        },
        // 선택한 항목 삭제
        deleteItem(item) {
            const employeeId = item.employeeId;
            this.selectedItems = this.selectedItems.filter(item => item.employeeId !== employeeId);
        },
        // 사원 등록
        async saveEmployeeDepartment() {
            if (this.selectedItems.length > 0) {
                this.$emit('success', this.selectedItems);
            }
        },
        close() {
            this.$emit('close');
        },
    },
};
</script>

<style>
.v-data-table__wrapper {
    overflow: auto !important;
    max-height: 300px;
}
</style>
