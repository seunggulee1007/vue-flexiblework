<template>
    <main class="modal_container">
        <v-toolbar color="purple darken-2" dark flat>
            <v-toolbar-title class="pl-5">유연근무 그룹 등록</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <section class="modal_section"></section>
    </main>
</template>

<script>
export default {
    methods: {
        close() {
            this.$emit('close');
        },
    },
};
</script>

<style></style>
