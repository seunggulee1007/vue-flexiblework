<template>
    <v-container>
        <v-card>
            <v-card-title>유연근무 현황</v-card-title>
            <v-card-actions>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <div>
                            <v-select
                                :items="[
                                    { code: 1, name: '유연근무유형' },
                                    { code: 2, name: '유연근무명칭' },
                                ]"
                                item-text="name"
                                item-value="code"
                                label="검색유형 선택"
                                outlined
                            >
                            </v-select>
                            <v-text-field label="검색어" placeholder="입력하세요." required />
                            <v-btn color="primary" class="mx-1" large>조회</v-btn>
                            <v-btn color="error" class="mx-1" large v-bind="attrs" v-on="on">
                                유연근무 유형 등록하기<v-icon right dark> mdi-plus-circle-outline </v-icon>
                            </v-btn>
                        </div>
                    </template>
                    <v-card v-if="dialog">
                        <register-flexible-work-form></register-flexible-work-form>
                    </v-card>
                </v-dialog>
            </v-card-actions>
            <v-card class="ma-4; pa-5">
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
            </v-card>
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
                    divider: true,
                },
                {
                    text: '유연근무명칭',
                    value: 'name',
                    align: 'center',
                    divider: true,
                },
                {
                    text: '1일 근로 시간',
                    value: 'hour',
                    align: 'center',
                    divider: true,
                },
                {
                    text: '근무요일',
                    value: 'day',
                    align: 'center',
                    divider: true,
                },
                {
                    text: '정산단위기간',
                    value: 'period',
                    align: 'center',
                    divider: true,
                },
                {
                    text: '휴게시간우뮤',
                    value: 'rest',
                    align: 'center',
                    divider: true,
                },
                {
                    text: '의무시간유무',
                    value: 'need',
                    align: 'center',
                    divider: true,
                },
                {
                    text: '근무시간',
                    value: 'workTiem',
                    align: 'center',
                    divider: true,
                },
                {
                    text: '근무대상자수',
                    value: 'workPersonCnt',
                    align: 'center',
                    divider: true,
                },
                {
                    text: '시작일',
                    value: 'startDate',
                    align: 'center',
                    divider: true,
                },
                {
                    text: '종료일',
                    value: 'endDate',
                    align: 'center',
                    divider: true,
                },
                {
                    text: '사용유무',
                    value: 'use',
                    align: 'center',
                    divider: true,
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
