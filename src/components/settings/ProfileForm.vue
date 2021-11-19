<template>
    <div>
        <v-toolbar color="purple darken-2" dark flat>
            <v-toolbar-title class="pl-5">프로필 미리보기</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container>
            <v-card align="center" class="pa-3">
                <v-avatar :size="imageSize">
                    <v-img :src="cropImg"></v-img>
                </v-avatar>
                <v-divider class="my-3" />
                <div class="text-center py-2">
                    <v-btn color="success" @click="confirm" class="mr-3">확인</v-btn>
                    <v-btn color="gray lighten-3" @click="close">취소</v-btn>
                </div>
            </v-card>
        </v-container>
    </div>
</template>

<script>
export default {
    props: ['cropImg'],
    computed: {
        imageSize() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs':
                    return 170;
                default:
                    return 250;
            }
        },
    },
    methods: {
        confirm() {
            this.$emit('confirm');
        },
        close() {
            this.$emit('close');
        },
    },
};
</script>

<style></style>
