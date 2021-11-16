<template>
    <v-main>
        <v-container fluid class="fill-height">
            <router-view />
        </v-container>
        <v-overlay :value="isProcess">
            <v-card width="300">
                <v-card-text class="text-center">{{ processMsg }}</v-card-text>
                <v-progress-linear indeterminate color="green"></v-progress-linear>
            </v-card>
        </v-overlay>
    </v-main>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'app-main',
    computed: {
        ...mapGetters(['isProcess', 'processMsg']),
    },
};
</script>

<style></style>
