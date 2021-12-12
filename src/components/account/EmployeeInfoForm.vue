<template>
    <main class="modal_container">
        <section class="modal_section" style="min-height: 700px">
            <v-row class="justify-content-center">
                <v-col cols="12" md="4">
                    <v-row justify="center" style="min-height: 200px" class="mt-5"> test </v-row>

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
                            <profile v-if="viewItems == 1" :ACCOUNT="ACCOUNT"></profile>
                        </v-tab-item>
                        <v-tab-item>
                            <change-pwd v-if="viewItems == 2"></change-pwd>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </section>
    </main>
</template>

<script>
import { mapGetters } from 'vuex';
import Profile from '@/components/settings/Profile.vue';
import ChangePwd from '@/components/settings/ChangePwd.vue';
import { toSvg } from 'jdenticon';
export default {
    computed: {
        ...mapGetters(['ACCOUNT']),
        identicon() {
            return toSvg(this.ACCOUNT.userName, 125);
        },
    },
    components: {
        Profile,
        ChangePwd,
    },
    data() {
        return {
            currentItem: 'tab-Web',
            viewItems: 1,
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
        },
    },
};
</script>

<style></style>
