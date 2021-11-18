<template>
    <v-app style="background: #f0f0f2; height: 100%">
        <authentication-view />
    </v-app>
</template>

<script>
import AuthenticationView from '@/layout/authentication/AppMain.vue';

export default {
    components: {
        AuthenticationView,
    },
};
</script>

<style></style>
