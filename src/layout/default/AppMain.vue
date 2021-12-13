<template>
    <v-main>
        <v-container fluid class="fill-height main_container mt-5 rounded-xl" elevation="2">
            <router-view />
        </v-container>
        <OverlayAndSnackbar></OverlayAndSnackbar>
    </v-main>
</template>

<script>
import OverlayAndSnackbar from '@/components/common/OverlayAndSnackbar.vue';
export default {
    name: 'app-main',
    components: {
        OverlayAndSnackbar,
    },
};
</script>

<style>
.main_container {
    min-height: 756px;
    background: white;
}
.main_container > div.container {
    height: 100%;
}
</style>
