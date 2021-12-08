<template>
    <v-dialog v-model="dialog" persistent max-width="290">
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                :color="btnColor"
                :outlined="outlined"
                :rounded="rounded"
                :block="block"
                :depressed="depressed"
                :disabled="disabled"
                v-bind="attrs"
                v-on="on"
                :x-small="btnSize == 'x-small'"
                :small="btnSize == 'small'"
                :large="btnSize == 'large'"
                :x-large="btnSize == 'x-large'"
                class="mx-3"
            >
                {{ btnText }}
            </v-btn>
        </template>
        <v-card>
            <v-toolbar dark color="primary" dense>
                <v-card-title class="text-h5"> {{ confirmText }} </v-card-title>
            </v-toolbar>
            <v-card-text v-if="confirmDetailText" class="pt-10">{{ confirmDetailText }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="success"> {{ okText }} </v-btn>
                <v-btn color="green darken-1" text @click="fail"> {{ cancelText }} </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    computed: {
        toolbarColor() {
            switch (this.confirmType) {
                case 'info':
                    return 'primary';
                case 'warning':
                    return 'yellow';
                case 'error':
                    return 'error';
                case 'success':
                    return 'success';
                default:
                    return 'secondary';
            }
        },
    },
    props: {
        depressed: {
            type: Boolean,
            default: false,
        },
        block: {
            type: Boolean,
            default: false,
        },
        rounded: {
            type: Boolean,
            default: false,
        },
        outlined: {
            type: Boolean,
            default: false,
        },
        confirmType: {
            type: String,
            default: 'info',
        },
        btnSize: {
            type: String,
            default: '',
        },
        btnColor: {
            type: String,
            default: 'primary',
        },
        btnText: {
            type: String,
            default: '저장',
        },
        confirmText: {
            type: String,
            default: '확인',
        },
        confirmDetailText: {
            type: String,
            default: '',
        },
        okText: {
            type: String,
            default: '예',
        },
        cancelText: {
            type: String,
            default: '아니오',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dialog: false,
        };
    },
    methods: {
        success() {
            this.$emit('success');
            this.dialog = false;
        },
        fail() {
            this.$emit('fail');
            this.dialog = false;
        },
    },
};
</script>

<style></style>
