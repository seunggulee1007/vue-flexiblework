<template>
    <main class="modal_container">
        <section class="modal_section" style="min-height: 700px">
            <v-row class="justify-content-center" style="margin-right: 12px; margin-left: 1px">
                <v-col cols="12" md="4">
                    <v-row justify="center" style="min-height: 130px" class="mt-5">
                        <v-avatar class="outlined mt-5" :size="imageSize">
                            <v-img v-if="account.profileImage" :src="account.profileImage"></v-img>
                            <v-img v-else v-html="identicon"></v-img>
                        </v-avatar>
                    </v-row>
                    <v-row justify="center" style="min-height: 30px">{{ account.userName }}</v-row>
                    <v-row justify="center" class="mb-5" style="min-height: 40px; color: rgba(0, 0, 0, 0.54)">{{
                        account.email
                    }}</v-row>

                    <v-divider />

                    <v-row justify="center" class="mt-5 px-3">
                        <v-tabs :vertical="!$vuetify.breakpoint.mobile" v-model="currentItem">
                            <v-tab v-for="item in tabs" :key="item.id" @click="viewItems = item.id">
                                <v-icon class="mr-4">{{ item.icon }}</v-icon>
                                {{ item.name }}
                            </v-tab>
                        </v-tabs>
                    </v-row>
                </v-col>

                <v-divider vertical />

                <v-col cols="12" md="8" style="min-height: 695px">
                    <v-tabs-items v-model="currentItem">
                        <v-tab-item>
                            <v-toolbar flat class="px-2 mt-10">
                                <v-card-title>인사정보</v-card-title>
                                <v-spacer />
                                <v-btn @click="editEmployee()" color="secondary" outlined
                                    >수정<v-icon right> mdi-pencil </v-icon></v-btn
                                >
                            </v-toolbar>
                            <employee-info-form
                                v-if="viewItems == 1 && !editable"
                                :account="account"
                                @close="close"
                            ></employee-info-form>
                            <register-employee-info-form
                                v-if="viewItems == 1 && editable"
                                :account="account"
                                @close="close"
                                @closeEditable="closeEditEmployee"
                            ></register-employee-info-form>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-title class="px-10 mt-10">근무계획</v-card-title>
                            <change-pwd v-if="viewItems == 2"></change-pwd>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </section>
    </main>
</template>

<script>
import ChangePwd from '@/components/settings/ChangePwd.vue';
import EmployeeInfoForm from '@/components/account/employee/info/EmployeeInfoForm.vue';
import { toSvg } from 'jdenticon';
import RegisterEmployeeInfoForm from '@/components/account/employee/info/RegisterEmployeeInfoForm';
export default {
    props: ['account'],
    computed: {
        identicon() {
            return toSvg(this.account.userName, 100);
        },
        imageSize() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs':
                    return 90;
                default:
                    return 90;
            }
        },
    },
    components: {
        RegisterEmployeeInfoForm,
        EmployeeInfoForm,
        ChangePwd,
    },
    data() {
        return {
            currentItem: 'tab-Web',
            viewItems: 1,
            editable: false,
            isOnwer: true,
            tabs: [
                {
                    id: 1,
                    icon: 'mdi-account',
                    name: '인사정보',
                },
                {
                    id: 2,
                    icon: 'mdi-alarm',
                    name: '근무계획',
                },
            ],
        };
    },
    methods: {
        changeTab(num) {
            this.currentItem = num;
            this.editable = false;
        },
        editEmployee() {
            this.editable = true;
        },
        close() {
            this.$emit('close');
        },
        closeEditEmployee() {
            this.editable = false;
        },
    },
};
</script>

<style>
.outlined {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 50%;
    height: 56px;
    width: 56px;
}
</style>
