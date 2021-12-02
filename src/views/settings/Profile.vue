<template>
    <v-container class="grey lighten-5 mb-6">
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-card-account-details</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="container_card">
            <v-row class="justify-content-center d-flex flex-row">
                <v-col cols="12" md="2" style="top: 0">
                    <v-tabs :vertical="!$vuetify.breakpoint.mobile" v-model="currentItem">
                        <v-tab v-for="item in tabs" :key="item.id" style="witdh: 50%" @click="viewItems = item.id">
                            {{ item.name }}
                        </v-tab>
                    </v-tabs>
                </v-col>
                <v-col cols="12" md="10">
                    <v-tabs-items v-model="currentItem">
                        <v-tab-item>
                            <profile v-if="viewItems == 1" :ACCOUNT="ACCOUNT"></profile>
                        </v-tab-item>
                        <v-tab-item>
                            <change-pwd v-if="viewItems == 2"></change-pwd>
                        </v-tab-item>
                        <v-tab-item>
                            <commute v-if="viewItems == 3"></commute>
                        </v-tab-item>
                        <v-tab-item>
                            <commute-status v-if="viewItems == 4"></commute-status>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import Profile from '@/components/settings/Profile.vue';
import ChangePwd from '@/components/settings/ChangePwd.vue';
import Commute from '@/components/settings/Commute.vue';
import CommuteStatus from '@/components/settings/CommuteStatus.vue';
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
        Commute,
        CommuteStatus,
    },
    data() {
        return {
            currentItem: 'tab-Web',
            viewItems: 1,
            isOnwer: true,
            tabs: [
                {
                    id: 1,
                    name: '프로필',
                },
                {
                    id: 2,
                    name: '패스워드',
                },
                {
                    id: 3,
                    name: '출퇴근',
                },
                {
                    id: 4,
                    name: '출퇴근 현황',
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
