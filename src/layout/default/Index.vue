<template>
    <v-app style="background: #f0f0f2; height: 100%">
        <app-header @updateNaviFlag="updateNaviFlag" :naviFlag="naviFlag" />
        <app-navi @updateNaviFlag="updateNaviFlag" :naviFlag="naviFlag" />
        <v-row>
            <v-col md="1"></v-col>
            <v-col cols="12" md="10">
                <v-responsive :aspect-ratio="16 / 9">
                    <app-main />
                    <v-footer v-bind="localAttrs" :padless="padless">
                        <v-card flat tile width="100%" class="grey lighten-1 text-center">
                            <v-card-text class="white--text">
                                서울특별시 광진구 동일로22길 91 3F (화양동 8-99) {{ new Date().getFullYear() }} —
                                <strong>separtners</strong>
                            </v-card-text>
                        </v-card>
                    </v-footer>
                </v-responsive>
            </v-col>
            <v-col md="1"></v-col>
        </v-row>
        <v-row> </v-row>
    </v-app>
</template>

<script>
import AppMain from '@/layout/default/AppMain.vue';
import AppHeader from '@/layout/default/AppHeader.vue';
import AppNavi from '@/layout/default/AppNavi.vue';

export default {
    components: {
        AppMain,
        AppHeader,
        AppNavi,
    },
    computed: {
        localAttrs() {
            const attrs = {};

            if (this.variant === 'default') {
                attrs.absolute = false;
                attrs.fixed = true;
            } else {
                attrs[this.variant] = true;
            }
            return attrs;
        },
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
