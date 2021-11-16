<template>
    <v-container>
        <v-form ref="departmentForm" v-model="departmentValid" lazy-validation>
            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field
                        v-model="department.departmentName"
                        :rules="[v => !!v || '부서명을 입력해 주세요.']"
                        label="부서명"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="department.departmentCode" label="부서 erp 코드"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="6" md="4">
                    <v-switch v-model="department.rightNow" label="즉시 등록 여부"></v-switch>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-switch v-model="department.active" label="사용 여부"></v-switch>
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="!department.rightNow">
                    <v-menu
                        v-model="department.pickerOn"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="department.applyDate"
                                label="적용날짜"
                                prepend-icon="mdi-calendar"
                                readonly
                                :rules="[v => (!!v && !department.rightNow) || '적용 날짜를 선택해 주세요']"
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            locale="ko"
                            v-model="department.applyDate"
                            @input="department.pickerOn = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> 취소 </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="saveDepartment"
                v-if="!department.departmentId"
                :disabled="!departmentValid"
            >
                등록
            </v-btn>
            <v-btn color="blue darken-1" text @click="modifyDepartment" :disabled="!departmentValid" v-else>
                수정
            </v-btn>
        </v-card-actions>
    </v-container>
</template>

<script>
import { saveDepartment, modifyDepartment } from '@/api/account';
export default {
    props: ['department', 'selected'],
    data() {
        return {
            departmentValid: false,
        };
    },
    methods: {
        // 부서 등록
        async saveDepartment() {
            if (this.$refs.departmentForm.validate()) {
                this.department.parentId = this.selected.departmentId;
                let res = await saveDepartment(this.department);
                this.successFlag = res.success;
                this.resultMsg = res.message;
                if (res.success) {
                    this.$emit('success');
                }
            }
        },
        // 부서 수정
        async modifyDepartment() {
            if (this.$refs.departmentForm.validate()) {
                let res = await modifyDepartment(this.department);
                this.successFlag = res.success;
                this.resultMsg = res.message;
                if (res.success) {
                    this.$emit('success');
                }
            }
        },
        close() {
            this.$emit('close');
        },
    },
};
</script>

<style></style>
