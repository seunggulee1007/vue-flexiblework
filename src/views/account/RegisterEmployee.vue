<template>
    <v-container>
        <v-alert type="warning" v-if="initialPasswordShow" dense outlined dismissible>
            {{ `초기 비밀번호는 ${this.initialPassword}입니다. \n이후에는 비밀번호를 확인할 수 없습니다.` }}</v-alert
        >
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-briefcase-account</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="px-5 py-15 mt-1 container_card" elevation="0">
            <v-col class="text-right">
                <v-dialog v-model="registerEmployeeDialog" max-width="700px" persistent>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="secondary"
                            outlined
                            :block="$vuetify.breakpoint.name == 'xs'"
                            class="mt-3"
                            v-bind="attrs"
                            v-on="on"
                        >
                            사원 등록<v-icon right> mdi-plus-circle-outline </v-icon>
                        </v-btn>
                    </template>
                    <v-card v-if="registerEmployeeDialog">
                        <register-employee-form
                            @close="closeRegisterEmployeeModal"
                            @save="saveRegisterEmployeeModal"
                        ></register-employee-form>
                    </v-card>
                </v-dialog>
            </v-col>

            <v-divider></v-divider>

            <v-row class="pa-4" justify="space-between">
                <v-col cols="12" md="6">
                    <v-treeview
                        :items="departmentList"
                        :open.sync="open"
                        item-text="departmentName"
                        item-key="departmentId"
                        open-on-click
                        transition
                        item-children="children"
                    >
                        <template v-slot:prepend="{ item }">
                            <v-icon
                                v-if="item.children.length > 0"
                                v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
                            ></v-icon>
                        </template>
                        <template v-slot:append="{ item }">
                            <v-btn @click="getEmployee(item, $event)" small color="secondary" outlined
                                >선택</v-btn
                            ></template
                        >
                    </v-treeview>
                </v-col>

                <v-divider vertical></v-divider>

                <v-col cols="12" md="6" class="text-center">
                    <v-card-title>{{ departmentName }}</v-card-title>
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-center">사원번호</th>
                                    <th class="text-center">사원명</th>
                                    <th class="text-center">이메일</th>
                                    <th class="text-center">입사일</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="item in employeeList"
                                    :key="item.employeeId"
                                    @click="handleClick(item.employeeId)"
                                >
                                    <td>{{ item.employeeId }}</td>
                                    <td>{{ item.userName }}</td>
                                    <td>{{ item.email }}</td>
                                    <td>{{ formatDate(new Date(item.hireDate), '-') }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                    <v-dialog v-model="employeeInfoDialog" max-width="1000px">
                        <v-card v-if="employeeInfoDialog">
                            <employee-info-form @close="closeEmployeeInfoModal"></employee-info-form>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
import { getDepartmentList } from '@/api/account';
import RegisterEmployeeForm from '@/components/account/RegisterEmployeeForm.vue';
import EmployeeInfoForm from '@/components/account/EmployeeInfoForm.vue';
export default {
    created() {
        this.getDepartmentList();
    },
    components: {
        RegisterEmployeeForm,
        EmployeeInfoForm,
    },
    data: () => ({
        initialPassword: '',
        initialPasswordShow: false,
        dialog: false,
        registerEmployeeDialog: false,
        employeeInfoDialog: false,
        departmentName: '',
        departmentList: [],
        employeeList: [],
        active: [],
        avatar: null,
        open: [],
        users: [],
    }),
    methods: {
        async getDepartmentList() {
            this.departmentName = '';
            let res = await getDepartmentList();
            if (res.success) {
                this.departmentList = res.response;
            }
        },
        async getEmployee(item, e) {
            e.stopPropagation();
            this.departmentName = item.departmentName;
            this.employeeList = item.employeeDtoList;
        },
        handleClick() {
            this.employeeInfoDialog = true;
        },
        closeRegisterEmployeeModal() {
            this.registerEmployeeDialog = false;
        },
        saveRegisterEmployeeModal(password) {
            this.getDepartmentList();
            this.initialPassword = password;
            this.initialPasswordShow = true;
        },
        closeEmployeeInfoModal() {
            this.employeeInfoDialog = false;
        },
    },
};
</script>

<style>
.v-data-table__wrapper tbody tr :hover {
    cursor: pointer;
}
</style>
