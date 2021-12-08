<template>
    <v-main>
        <router-view />
        <OverlayAndSnackbar></OverlayAndSnackbar>
    </v-main>
</template>

<script>
import OverlayAndSnackbar from '@/components/common/OverlayAndSnackbar.vue';
export default {
    name: 'AdministratorView',
    components: {
        OverlayAndSnackbar,
    },
};
</script>

<style></style>
