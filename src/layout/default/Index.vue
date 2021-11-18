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
                                {{ new Date().getFullYear() }} — <strong>separtners</strong>
                            </v-card-text>
                        </v-card>
                    </v-footer>
                </v-responsive>
            </v-col>
            <v-col md="1"></v-col>
        </v-row>
        <v-row> </v-row>
        <v-overlay :value="overlay">
            <v-row class="justify-center mb-5">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </v-row>
            <v-row>
                <v-card>
                    <v-card-text> 조회중입니다. 조회가 오래 걸릴경우 새로고침(F5)를 눌러주세요. </v-card-text>
                </v-card>
            </v-row>
        </v-overlay>
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
            overlay: false,
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
