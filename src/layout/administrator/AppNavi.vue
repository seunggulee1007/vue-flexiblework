<template>
    <v-card>
        <v-navigation-drawer
            class="grey darken-3 accent-4"
            :mini-variant.sync="navis"
            :permanent="!navis"
            :temporary="isMobile && !navis"
            m
            dark
            app
            :src="require('@/assets/desk.jpg')"
        >
            <template #img="props">
                <v-img :gradient="gradient" v-bind="props"></v-img>
            </template>
            <v-list>
                <v-list-item class="px-2">
                    <v-list-item-avatar>
                        <v-img v-html="identicon" v-if="!ACCOUNT.profileImage"></v-img>
                        <v-img v-else :src="ACCOUNT.profileImage"></v-img>
                    </v-list-item-avatar>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.stop="updateNaviFlag">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                </v-list-item>
                <v-list-item link to="/settings/profile">
                    <v-list-item-content>
                        <v-list-item-title class="text-h6"> {{ ACCOUNT.userName }} </v-list-item-title>
                        <v-list-item-subtitle>{{ ACCOUNT.email }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <default-list :items="menus" />
            <template v-slot:append>
                <div class="pa-2" v-if="!navis">
                    <confirm-dialog
                        :btnColor="'error'"
                        :outlined="true"
                        :rounded="true"
                        :block="true"
                        :btnText="'Logout'"
                        :confirmDetailText="'로그아웃 하시겠습니까?'"
                        @success="logout"
                        :depressed="true"
                    ></confirm-dialog>
                </div>
            </template>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import { mapGetters, mapMutations } from 'vuex';
import { toSvg } from 'jdenticon';
export default {
    watch: {
        isNaviFlag(value) {
            console.log(value);
            this.navis = value;
        },
        navis(value) {
            this.toggleNaviFlag(value);
        },
    },
    computed: {
        ...mapGetters(['ACCOUNT', 'isNaviFlag']),
        identicon() {
            return toSvg(this.ACCOUNT.userName, 255);
        },
        isMobile() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs':
                    return true;
                default:
                    return false;
            }
        },
    },
    components: {
        ConfirmDialog,
        DefaultList: () =>
            import(
                /* webpackChunkName: "default-list" */
                '../default/List'
            ),
    },
    data() {
        return {
            navis: true,
            gradient: 'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
            menus: [
                {
                    id: 1,
                    name: '기준정보관리',
                    path: '',
                    icon: 'mdi-cog-outline',
                    children: [
                        {
                            id: 101,
                            name: '메뉴',
                            path: '',
                            icon: '',
                            children: [
                                {
                                    id: 1031,
                                    name: '메뉴관리',
                                    path: '/administrator/menu/manage-menu',
                                    children: [],
                                },
                                {
                                    id: 1032,
                                    name: '메뉴권한관리',
                                    path: '',
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 102,
                            name: '사원관리',
                            path: '',
                            icon: '',
                            children: [
                                {
                                    id: 1031,
                                    name: '사원 현황',
                                    path: '',
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 2,
                    name: '유연근무 관리',
                    path: '',
                    icon: 'mdi-folder-clock',
                    children: [
                        {
                            id: 201,
                            name: '유연근무유형관리',
                            path: '',
                            children: [
                                {
                                    id: 2011,
                                    name: '유연근무유형현황',
                                    path: '/flexible-work/flexible-work-type/flexible-work-status',
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 202,
                            name: '유연근무대상관리',
                            path: '',
                            children: [
                                {
                                    id: 2021,
                                    name: '유연근무그룹현황',
                                    path: '/flexible-work/flexible-work-group/flexible-work-group-status',
                                    children: [],
                                },
                                {
                                    id: 2021,
                                    name: '유연근무대상현황',
                                    path: '',
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 203,
                            name: '출퇴근허용지역관리',
                            path: '',
                            children: [
                                {
                                    id: 2031,
                                    name: '출퇴근허용지역현황',
                                    path: '/flexiblework/commute/work-area-list',
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 3,
                    name: '출/퇴근관리',
                    path: '',
                    icon: 'mdi-map-marker-check',
                    children: [
                        {
                            id: 301,
                            name: '근무계획관리',
                            path: '',
                            children: [
                                {
                                    id: 3011,
                                    name: '근무계획현황',
                                    path: '',
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 302,
                            name: '출/퇴근등록',
                            path: '',
                            children: [
                                {
                                    id: 3021,
                                    name: '출/퇴근등록 현황',
                                    path: '',
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        ...mapMutations(['clearLoginInfo', 'toggleNaviFlag']),
        updateNaviFlag() {
            this.toggleNaviFlag(true);
        },
        async logout() {
            this.clearLoginInfo();
            this.$router.push('/authentication/sign-in').catch(e => {
                console.log(e);
            });
        },
    },
};
</script>

<style></style>
