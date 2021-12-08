<template>
    <main class="modal_container">
        <v-toolbar color="purple darken-2" dark flat>
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
                                v-model="authorityGroup.authorityGroupName"
                                label="그룹명"
                                :rules="[
                                    v => !!v || '그룹명을 입력해 주세요',
                                    (!originGroupName && confirmDupleResult) ||
                                        (originGroupName == authorityGroup.authorityGroupName && !confirmDupleResult) ||
                                        '중복체크를 진행해 주세요.',
                                ]"
                            />
                        </v-col>
                        <v-col cols="2">
                            <v-btn
                                class="mt-3"
                                color="primary"
                                :disabled="
                                    (!originGroupName && confirmDupleResult) ||
                                    (originGroupName == authorityGroup.authorityGroupName && !confirmDupleResult)
                                "
                                @click="confirmDupleName"
                                >중복확인</v-btn
                            >
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <v-switch v-model="authorityGroup.basic" label="기본적용여부"> </v-switch>
                        </v-col>
                        <v-col cols="4">
                            <v-switch v-model="authorityGroup.active" label="사용여부"></v-switch>
                        </v-col>
                        <v-col cols="4">
                            <v-switch v-model="authorityGroup.admin" label="관리자여부"></v-switch>
                        </v-col>
                    </v-row>
                    <v-dialog v-model="empDialog" max-width="800px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" small v-bind="attrs" v-on="on"> 사원 등록 </v-btn>
                        </template>
                        <v-card v-if="empDialog">
                            <search-employee-form
                                :selected="selected"
                                @close="closeEmpDialog"
                                @success="success"
                            ></search-employee-form>
                        </v-card>
                    </v-dialog>
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
                    <v-btn color="warning" depressed rounded outlined @click="close"> 취소 </v-btn>
                </v-card-actions>
            </v-card>
        </section>
    </main>
</template>

<script>
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import SearchEmployeeForm from '@/components/account/SearchEmployeeForm.vue';
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
    data() {
        return {
            valid: false,
            btnText: '등록',
            confirmText: '등록하시겠습니까?',
            confirmDupleResult: false,
            authorityGroup: {},
            originGroupName: '',
            empDialog: false,
            selected: [],
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        saveGroup() {
            if (this.$refs.authorigyGroup.validate()) {
                if (this.authorityGroup.authorityGroupId) {
                    // TODO 수정 로직
                } else {
                    // TODO 등록 로직
                }
                this.$emit('success');
            }
        },
        confirmDupleName() {
            this.confirmDupleResult = true;
        },
        closeEmpDialog() {
            this.empDialog = false;
        },
        success(items) {
            console.log(items);
        },
    },
};
</script>

<style></style>
