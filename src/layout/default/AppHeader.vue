<template>
    <v-app-bar app color="white">
        <v-app-bar-nav-icon v-if="$vuetify.breakpoint.mobile" @click="updateNaviFlag"></v-app-bar-nav-icon>
        <v-toolbar-title class="pl-10">
            <router-link class="text-h4 font-weight-bold home_link" to="/dashboard">Separtners</router-link>
        </v-toolbar-title>
        <v-spacer />
        <v-chip class="mr-5" @click="toggleDark" v-if="!isDark"><v-icon>mdi-weather-night</v-icon>Night mode</v-chip>
        <v-chip class="mr-5" @click="toggleDark" v-else><v-icon>mdi-weather-sunny</v-icon>Light mode</v-chip>
        <router-link class="home_link" to="/admin/menu/manage-menu" v-if="isSuperAdmin">
            <v-btn color="secondary" outlined>관리자 화면 </v-btn>
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
        ...mapGetters(['isNaviFlag', 'isSuperAdmin', 'isDark']),
    },
    data() {
        return {
            navis: true,
        };
    },
    methods: {
        ...mapMutations(['toggleNaviFlag', 'toggleDark']),
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
