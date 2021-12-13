import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: () => import('@/layout/default/Index'),
        children: [
            {
                path: '/',
                redirect: '/dashboard',
            },
            {
                path: '/dashboard',
                name: '대시보드',
                component: () => import(/* webpachChunkName: "DashBoard" */ '@/views/DashBoard.vue'),
            },

            {
                path: '/breakpoint',
                name: 'breakpoint예제',
                component: () => import('@/views/breakpoints'),
            },
            {
                path: '/typography',
                name: 'typography 예제',
                component: () => import('@/views/typography'),
            },
            {
                path: '/settings/profile',
                name: '프로필 수정',
                component: () => import('@/views/settings/Profile.vue'),
            },
            {
                path: '/test',
                name: 'test',
                component: () => import('@/views/test.vue'),
            },
            {
                path: '/flexible-work/flexible-work-status',
                name: '유연근무 현황',
                component: () => import('@/views/flexibleWork/FlexibleWorkStatus.vue'),
            },
            {
                path: '/check-email-token',
                name: '이메일 인증',
                meta: { auth: true },
                component: () => import('@/views/CheckEmailToken.vue'),
            },
            {
                path: '/settings/enable-work-area',
                name: '출퇴근 허용 지역',
                component: () => import('@/views/settings/EnableWorkArea.vue'),
            },
            {
                path: '/settings/work-area-list',
                name: '출퇴근 허용 지역 현황',
                component: () => import('@/views/settings/WorkAreaList.vue'),
            },
            {
                path: '/account/register-department',
                name: '부서 등록 및 관리',
                component: () => import('@/views/account/RegisterDepartment.vue'),
            },
        ],
    },
    {
        path: '/authentication',
        component: () => import('@/layout/authentication/Index'),
        children: [
            {
                path: 'sign-in',
                name: '로그인',
                meta: { auth: true },
                component: () => import('@/views/authentication/SignIn'),
            },
            {
                path: 'sign-up',
                name: '회원가입',
                meta: { auth: true },
                component: () => import('@/views/authentication/SignUp'),
            },
        ],
    },
    {
        path: '/page',
        component: () => import('@/layout/page/Index.vue'),
        children: [],
    },
    {
        path: '*',
        name: '404',
        component: () => import('@/views/NotFound.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    if (!to.meta.auth && !store.getters.isLogin) {
        next('/authentication/sign-in');
    }
    next();
});

export default router;
