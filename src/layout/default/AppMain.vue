<template>
    <v-main>
        <v-container fluid class="fill-height main_container mt-5 rounded-xl" elevation="2">
            <router-view />
        </v-container>
        <v-overlay :value="isProcess">
            <v-card width="300">
                <v-card-text class="text-center">{{ processMsg }}</v-card-text>
                <v-progress-linear indeterminate color="green"></v-progress-linear>
            </v-card>
        </v-overlay>
        <v-snackbar
            :color="snackbarColor"
            :timeout="snackbarTimeout"
            elevation="20"
            v-model="snackbar"
            class="mb-15"
            :width="snackbarSize"
        >
            {{ snackbarMessage }}
            <template v-slot:action="{ attrs }">
                <v-btn icon v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-close-box-outline</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-main>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
    name: 'app-main',
    computed: {
        ...mapGetters(['isProcess', 'processMsg', 'snackbarMessage', 'isSnackbar', 'snackbarTimeout', 'snackbarColor']),
        snackbarSize() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs':
                    return 300;
                default:
                    return 800;
            }
        },
    },
    watch: {
        isSnackbar() {
            this.snackbar = this.isSnackbar;
        },
    },
    data() {
        return {
            snackbar: false,
        };
    },
    methods: {
        ...mapMutations(['endSnackbar']),
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
