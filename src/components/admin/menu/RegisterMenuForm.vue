<template>
    <main class="modal_container">
        <v-toolbar color="modal" dark flat>
            <v-toolbar-title class="pl-5">메뉴 등록</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <section class="modal_section">
            <v-card :loading="loading">
                <v-form ref="menuForm" v-model="valid" lazy-validation class="pa-10">
                    <v-row>
                        <v-text-field
                            :rules="[v => !!v || '메뉴명을 입력해주세요.']"
                            v-model="menu.menuName"
                            label="메뉴명"
                        />
                    </v-row>
                    <v-row>
                        <v-text-field v-model="menu.menuPath" label="메뉴 경로" />
                    </v-row>
                    <v-row>
                        <v-switch label="사용여부" v-model="menu.active"></v-switch>
                    </v-row>
                </v-form>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <confirm-dialog
                        btnColor="primary"
                        :outlined="true"
                        :rounded="true"
                        btnText="저장"
                        confirmDetailText="메뉴를 저장하시겠습니까?"
                        @success="saveMenu"
                        btnSize="large"
                        depressed
                        :disabled="!valid"
                    ></confirm-dialog>
                    <v-btn color="cancel" large depressed rounded outlined @click="close"> 취소 </v-btn>
                </v-card-actions>
            </v-card>
        </section>
    </main>
</template>

<script>
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
export default {
    data() {
        return {
            loading: false,
            valid: false,
        };
    },
    components: {
        ConfirmDialog,
    },
    props: ['menu'],
    methods: {
        close() {
            this.$emit('close');
        },
        saveMenu() {
            if (this.$refs.menuForm.validate()) {
                let flag = true;
                if (this.menu.menuId) {
                    flag = false;
                }
                this.$emit('success', flag, this.menu);
            }
        },
    },
};
</script>

<style></style>
