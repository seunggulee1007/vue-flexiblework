<template>
    <main class="modal_main">
        <v-toolbar flat class="my-5">
            <v-toolbar-title class="mt-5 pa-5 text-h4">{{
                `[${selected.departmentName}] 하위 부서 등록`
            }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close" class="mt-5">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <section class="modal_section">
            <v-card>
                <v-form ref="departmentForm" v-model="departmentValid" lazy-validation class="pa-10">
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field
                                v-model="department.departmentName"
                                :rules="[v => !!v || '부서명을 입력해 주세요.']"
                                label="부서명"
                            ></v-text-field>
                        </v-col>
                        <v-divider vertical></v-divider>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="department.departmentCode" label="부서 erp 코드"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-switch v-model="department.rightNow" label="즉시 등록 여부"></v-switch>
                        </v-col>
                        <v-divider vertical></v-divider>
                        <v-col cols="12" sm="6" md="6">
                            <v-switch v-model="department.active" label="사용 여부"></v-switch>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6" md="6" v-if="!department.rightNow">
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
                        <v-divider vertical></v-divider>
                    </v-row>
                </v-form>
                <v-divider class="mt-5"></v-divider>
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
            </v-card>
        </section>
    </main>
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
