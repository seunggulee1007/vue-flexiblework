<template>
    <main class="modal_main">
        <v-toolbar color="modal" dark flat>
            <v-toolbar-title class="pl-5"> <v-icon large>mdi-account-plus-outline</v-icon> 사원 등록</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-divider />
        <section class="modal_section pa-7">
            <v-card>
                <v-card-title>
                    사원명
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    v-model="selectedItems"
                    :headers="headers"
                    :items="items"
                    item-key="employeeId"
                    :options.sync="options"
                    :server-items-length="totalItems"
                    :loading="loading"
                    show-select
                    class="elevation-1"
                ></v-data-table>
            </v-card>
            <div class="mt-6">
                <v-data-table :headers="selectedHeaders" :items="selectedItems" class="elevation-1">
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
            </div>
        </section>
    </main>
</template>

<script>
import { getEmployeeList } from '@/api/employee';
//import { saveEmployeeDepartment } from '@/api/account/employmentManagement';
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';

export default {
    props: ['selected'],
    mounted() {
        this.loadSelectedItems();
    },
    components: {
        ConfirmDialog,
    },
    data() {
        return {
            search: '',
            totalItems: 0,
            items: [],
            loading: true,
            options: {
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 10,
            },
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
    watch: {
        options: {
            handler() {
                this.getEmployeeList();
            },
            deep: true,
        },
        search: {
            handler() {
                this.getEmployeeList();
            },
        },
    },
    methods: {
        // 등록된 사원 가져오기
        loadSelectedItems() {
            this.selectedItems = this.selected.employeeDtoList;
        },
        // 미등록된 사원 가져오기
        async getEmployeeList() {
            this.loading = true;
            const param = {
                userName: this.search,
                email: '',
                number: this.options.page - 1,
                size: this.options.itemsPerPage,
                departmentId: this.selected.departmentId,
            };

            console.log(param);

            let res = await getEmployeeList(param);
            console.log(res);
            if (res.success) {
                this.items = res.response.content;
                this.totalItems = res.response.totalElements;
            }
            this.loading = false;
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
            } else {
                alert('선택한 항목이 없습니다.');
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
