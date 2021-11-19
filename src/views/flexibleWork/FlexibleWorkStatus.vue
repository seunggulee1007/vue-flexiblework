<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-briefcase</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="px-5 py-15">
            <v-row>
                <v-col cols="12" md="2" sm="6">
                    <v-select
                        :items="[
                            { code: 1, name: '유연근무유형' },
                            { code: 2, name: '유연근무명칭' },
                        ]"
                        item-text="name"
                        item-value="code"
                        label="검색유형 선택"
                        outlined
                        dense
                        class="mt-3"
                    >
                    </v-select>
                </v-col>
                <v-col cols="12" sm="8">
                    <v-text-field
                        width="150"
                        label="검색어"
                        append-icon="mdi-magnify"
                        placeholder="입력하세요."
                        required
                        style="width: 60%; display: inline-block"
                        class="mr-3"
                    />
                    <v-btn color="primary">조회</v-btn>
                </v-col>
                <v-col cols="12" lg="2" class="text-right">
                    <v-dialog v-model="dialog" max-width="700px" persistent>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="error" class="pr-2 mt-3" block v-bind="attrs" v-on="on">
                                근무유형 등록<v-icon right dark> mdi-plus-circle-outline </v-icon>
                            </v-btn>
                        </template>
                        <v-card v-if="dialog">
                            <register-flexible-work-form @close="closeModal"></register-flexible-work-form>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
            <v-divider class="my-10" />
            <v-row>
                <v-col cols="12">
                    <v-data-table :items="itemList" :headers="headers" hide-default-footer class="elevation-1">
                        <template v-slot:item.rest="{ item }">
                            <v-tooltip v-model="item.show" top>
                                <template v-slot:activator="{ on, attrs }">
                                    {{ item.rest }}
                                    <v-btn icon v-bind="attrs" v-on="on">
                                        <v-icon color="grey lighten-1"> mdi-information-outline </v-icon>
                                    </v-btn>
                                </template>

                                <span>
                                    <div>
                                        <table>
                                            <tr>
                                                <th>No.</th>
                                                <th>시간</th>
                                            </tr>
                                            <tr v-for="(rest, idx) in item.rests" :key="rest.id">
                                                <td>{{ idx }}</td>
                                                <td>{{ `${rest.startRest} ~ ${rest.endRest}` }}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import RegisterFlexibleWorkForm from '@/components/flexibleWork/RegisterFlexibleWorkForm.vue';
export default {
    components: {
        RegisterFlexibleWorkForm,
    },
    data() {
        return {
            dialog: false,
            headers: [
                {
                    text: '유연근무유형',
                    value: 'type',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '유연근무명칭',
                    value: 'name',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '1일 근로 시간',
                    value: 'hour',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '근무요일',
                    value: 'day',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '정산단위기간',
                    value: 'period',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '휴게시간우뮤',
                    value: 'rest',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '의무시간유무',
                    value: 'need',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '근무시간',
                    value: 'workTiem',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '근무대상자수',
                    value: 'workPersonCnt',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '시작일',
                    value: 'startDate',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '종료일',
                    value: 'endDate',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '사용유무',
                    value: 'use',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
            ],
            itemList: [
                {
                    type: '시차출퇴근제',
                    name: '생산관리팀 7시 출근',
                    hour: '8시간',
                    day: '근무 요일',
                    period: '1주',
                    rest: '있음',
                    need: '없음',
                    workTiem: '07:00~16:00',
                    workPersonCnt: '3명',
                    startDate: '2021-01-01',
                    endDate: '9999-12-31',
                    use: '사용',
                    rests: [
                        { id: 0, startRest: '10:00', endRest: '11:00' },
                        { id: 1, startRest: '15:00', endRest: '16:00' },
                    ],
                },
            ],
        };
    },
    methods: {
        closeModal() {
            this.dialog = false;
        },
    },
};
</script>

<style scoped>
table {
    border-collapse: collapse;
}

tr {
    border-top: 1px solid white;
    border-bottom: 1px solid white;
}
</style>
