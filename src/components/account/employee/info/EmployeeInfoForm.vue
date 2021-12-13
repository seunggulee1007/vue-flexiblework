<template>
    <v-container fluid class="px-6">
        <v-row>
            <v-col cols="4">
                <v-subheader>이메일</v-subheader>
            </v-col>
            <v-col cols="8">
                <v-text-field label="" v-model="account.email" readonly flat solo></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="4">
                <v-subheader>사원명</v-subheader>
            </v-col>
            <v-col cols="8">
                <v-text-field label="" v-model="account.userName" readonly flat solo></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="4">
                <v-subheader>부서</v-subheader>
            </v-col>
            <v-col cols="8">
                <v-text-field label="" v-model="account.departmentName" readonly flat solo></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="4">
                <v-subheader>직급</v-subheader>
            </v-col>
            <v-col cols="8">
                <v-text-field label="" v-model="account.position" readonly flat solo></v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: ['account'],
    data() {
        return {};
    },
    methods: {
        close() {
            this.$emit('close');
        },
        closeSearchDepartmentModal() {
            this.searchDepartmentDialog = false;
        },
    },
};
</script>

<style></style>
