<template>
    <v-app-bar app color="white">
        <v-app-bar-nav-icon v-if="$vuetify.breakpoint.mobile" @click="updateNaviFlag"></v-app-bar-nav-icon>
        <v-toolbar-title class="pl-10">
            <router-link class="text-h4 font-weight-bold home_link" to="/dashboard">Separtners</router-link>
        </v-toolbar-title>
        <v-spacer />
        <router-link class="home_link" to="/admin/menu/manage-menu" v-if="isSuperAdmin">
            <v-btn color="secondary">관리자 화면 </v-btn>
        </router-link>
    </v-app-bar>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
    name: 'app-header',
    watch: {
        navis(value) {
            this.toggleNaviFlag(value);
        },
        isNaviFlag(value) {
            this.navis = value;
        },
    },
    computed: {
        ...mapGetters(['isNaviFlag', 'isSuperAdmin']),
    },
    data() {
        return {
            navis: true,
        };
    },
    methods: {
        ...mapMutations(['toggleNaviFlag']),
        updateNaviFlag() {
            this.navis = !this.navis;
        },
    },
};
</script>

<style scoped>
.home_link {
    text-decoration: none;
    color: black;
}
</style>
