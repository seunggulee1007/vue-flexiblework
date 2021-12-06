<template>
    <v-app style="background: #f0f0f2; height: 100%">
        <app-header @updateNaviFlag="updateNaviFlag" :naviFlag="naviFlag" />
        <app-navi @updateNaviFlag="updateNaviFlag" :naviFlag="naviFlag" />
        <v-row>
            <v-col md="1"></v-col>
            <v-col cols="12" md="10">
                <v-responsive :aspect-ratio="16 / 9">
                    <administrator-view />
                </v-responsive>
            </v-col>
            <v-col md="1"></v-col>
        </v-row>
    </v-app>
</template>

<script>
import AdministratorView from '@/layout/administrator/AppMain.vue';
import AppHeader from '@/layout/administrator/AppHeader.vue';
import AppNavi from '@/layout/administrator/AppNavi.vue';
export default {
    components: {
        AdministratorView,
        AppHeader,
        AppNavi,
    },
    data() {
        return {
            naviFlag: true,
            icons: ['mdi-home', 'mdi-email', 'mdi-calendar', 'mdi-delete'],
            items: ['default', 'absolute', 'fixed'],
            padless: false,
            variant: 'default',
        };
    },
    methods: {
        updateNaviFlag(flag) {
            this.naviFlag = flag;
        },
    },
};
</script>

<style></style>
