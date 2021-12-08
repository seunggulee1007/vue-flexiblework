<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-briefcase</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="px-5 py-15 mt-1 container_card">
            <v-row>
                <v-col cols="12" md="2" sm="6">
                    <v-select
                        :items="flexibleWorkTypeList"
                        item-text="title"
                        item-value="code"
                        label="유연근무 유형 선택"
                        outlined
                        dense
                        class="mt-3"
                        v-model="searchForm.flexibleWorkType"
                    >
                    </v-select>
                </v-col>
                <v-col cols="12" sm="7">
                    <v-text-field
                        width="150"
                        label="유연근무 명칭"
                        append-icon="mdi-magnify"
                        placeholder="입력하세요."
                        required
                        style="width: 60%; display: inline-block"
                        class="mr-3"
                        v-model="searchForm.flexibleWorkName"
                    />
                    <v-btn color="primary" @click="getFlexibleWorkList">조회</v-btn>
                </v-col>
                <v-col cols="12" lg="3" class="text-right">
                    <v-dialog v-model="dialog" max-width="700px" persistent>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="error" class="mt-3" v-bind="attrs" v-on="on">
                                근무유형 등록<v-icon right dark> mdi-plus-circle-outline </v-icon>
                            </v-btn>
                        </template>
                        <v-card v-if="dialog">
                            <flexible-work-form :flexibleWork="flexibleWork" @close="closeModal"></flexible-work-form>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
            <v-divider class="my-10" />
            <v-row>
                <v-col cols="12">
                    <v-tabs v-model="tab" icons-and-text>
                        <v-tab href="#tab-1">
                            테이블
                            <v-icon>mdi-table</v-icon>
                        </v-tab>

                        <v-tab href="#tab-2">
                            목록
                            <v-icon>mdi-format-list-numbered</v-icon>
                        </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                        <v-tab-item value="tab-1">
                            <v-data-table
                                :items="flexibleWorkList"
                                :headers="headers"
                                hide-default-footer
                                class="elevation-1 mt-5"
                                v-columns-resizable
                            >
                                <template v-slot:item.restExist="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            {{ item.restExist ? '있음' : '없음' }}
                                            <v-btn icon v-bind="attrs" v-on="on" v-if="item.restExist">
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
                                                    <tr v-for="(rest, idx) in item.restTimeList" :key="rest.id">
                                                        <td>{{ idx + 1 }}</td>
                                                        <td>{{ `${rest.startTime} ~ ${rest.endTime}` }}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </span>
                                    </v-tooltip>
                                </template>
                                <template v-slot:item.mandatoryTimeExist="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            {{ item.mandatoryTimeExist ? '있음' : '없음' }}
                                            <v-btn icon v-bind="attrs" v-on="on" v-if="item.mandatoryTimeExist">
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
                                                    <tr v-for="(time, idx) in item.mandatoryTimeList" :key="time.id">
                                                        <td>{{ idx + 1 }}</td>
                                                        <td>{{ `${time.startTime} ~ ${time.endTime}` }}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </span>
                                    </v-tooltip>
                                </template>
                                <template v-slot:item.workTime="{ item }">
                                    {{ item.startTime }} ~ {{ item.endTime }}
                                </template>
                                <template v-slot:item.actions="{ item }">
                                    <v-icon small class="mr-2" @click="editFlexibleWork(item)"> mdi-pencil </v-icon>
                                </template>
                            </v-data-table>
                        </v-tab-item>
                        <v-tab-item value="tab-2">
                            <v-row class="mt-5">
                                <v-col cols="12" md="3" sm="4" v-for="(item, idx) in flexibleWorkList" :key="idx">
                                    <v-card class="pa-3 mb-2">
                                        <v-toolbar elevation="0">
                                            <v-chip :color="item.active ? 'success' : 'secondary'">{{
                                                item.active ? '운영중' : '중단'
                                            }}</v-chip>
                                            <v-spacer />
                                            <v-btn icon><v-icon>mdi-cog-outline</v-icon></v-btn>
                                        </v-toolbar>
                                        <v-card-title>{{ item.flexibleWorkName }}</v-card-title>
                                        <v-card-text>
                                            <v-row align="center" class="mx-0">
                                                <div class="grey--text ms-4">{{ item.flexibleWorkType }}</div>
                                            </v-row>
                                            <v-row>
                                                <div>
                                                    <v-chip small class="mr-1">{{ item.settlementUnitPeriod }}</v-chip>
                                                    <v-chip small class="mr-1">{{ item.dailyWorkTime }}</v-chip>
                                                </div>
                                            </v-row>

                                            <div class="my-4 text-subtitle-1">{{ item.workDayOfWeek }}</div>
                                            <div class="text-caption">
                                                <v-icon small class="mr-1">mdi-calendar-month</v-icon>운영기간
                                                <span style="color: #64b5f6">{{
                                                    `${item.applyDateFrom} ~ ${item.applyDateTo} `
                                                }}</span>
                                            </div>
                                            <div class="text-caption">
                                                <v-icon small class="mr-1">mdi-coffee-outline </v-icon>휴게시간
                                                <span style="color: #64b5f6">{{
                                                    item.restExist ? '있음' : '없음'
                                                }}</span>
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn icon v-bind="attrs" v-on="on" v-if="item.restExist">
                                                            <v-icon color="grey lighten-1" small>
                                                                mdi-information-outline
                                                            </v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>
                                                        <div>
                                                            <table>
                                                                <tr>
                                                                    <th>No.</th>
                                                                    <th>시간</th>
                                                                </tr>
                                                                <tr
                                                                    v-for="(rest, idx) in item.restTimeList"
                                                                    :key="rest.id"
                                                                >
                                                                    <td>{{ idx + 1 }}</td>
                                                                    <td>{{ `${rest.startTime} ~ ${rest.endTime}` }}</td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </span>
                                                </v-tooltip>
                                            </div>
                                            <div class="text-caption">
                                                <v-icon small class="mr-1">mdi-account-lock-outline </v-icon>의무시간
                                                <span style="color: #64b5f6">{{
                                                    item.mandatoryTimeExist ? '있음' : '없음'
                                                }}</span>
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn
                                                            icon
                                                            v-bind="attrs"
                                                            v-on="on"
                                                            v-if="item.mandatoryTimeExist"
                                                        >
                                                            <v-icon color="grey lighten-1" small>
                                                                mdi-information-outline
                                                            </v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>
                                                        <div>
                                                            <table>
                                                                <tr>
                                                                    <th>No.</th>
                                                                    <th>시간</th>
                                                                </tr>
                                                                <tr
                                                                    v-for="(time, idx) in item.mandatoryTimeList"
                                                                    :key="time.id"
                                                                >
                                                                    <td>{{ idx + 1 }}</td>
                                                                    <td>{{ `${time.startTime} ~ ${time.endTime}` }}</td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </span>
                                                </v-tooltip>
                                            </div>
                                            <div class="text-caption">
                                                <v-icon small class="mr-1">mdi-account-group</v-icon>근무자
                                                <span style="color: #64b5f6">{{ item.workPersonCnt }}</span> 명
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { getCodeList, getFlexibleWorkList } from '@/api/flexibleWork';
import FlexibleWorkForm from '@/components/flexibleWork/workType/FlexibleWorkForm.vue';
export default {
    mounted() {
        this.getCodeList();
    },
    components: {
        FlexibleWorkForm,
    },
    data() {
        return {
            loading: false,
            dialog: false,
            headers: [
                {
                    text: '유연근무유형',
                    value: 'flexibleWorkType',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '유연근무명칭',
                    value: 'flexibleWorkName',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '1일 근로 시간',
                    value: 'dailyWorkTime',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '근무요일',
                    value: 'workDayOfWeek',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '정산단위기간',
                    value: 'settlementUnitPeriod',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '휴게시간우뮤',
                    value: 'restExist',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '의무시간유무',
                    value: 'mandatoryTimeExist',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '근무시간',
                    value: 'workTime',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '근무대상자수',
                    value: 'workPersonCnt',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '시작일',
                    value: 'applyDateFrom',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '종료일',
                    value: 'applyDateTo',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '사용유무',
                    value: 'active',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '비고',
                    align: 'center',
                    value: 'actions',
                    sortable: false,
                    divider: true,
                },
            ],
            flexibleWorkTypeList: [],
            defaultList: [{ code: '', title: '전체' }],
            searchForm: {
                flexibleWorkType: '',
                flexibleWorkName: '',
            },
            pageable: {
                number: 0,
                size: 10,
            },
            flexibleWorkList: [],
            flexibleWork: {
                flexibleWorkType: '', // 유연근무 제도
                flexibleWorkName: '', //유연근무명칭
                workDayOfWeekSet: [], //근무요일
                dailyWorkTime: '', // 1일 근로시간
                settlementUnitPeriod: '', // 정산단위기간
                applyDateFrom: new Date(), // 적용시작일자
                startTime: '', // 시작시간
                endTime: '', // 종료시간
                restExist: false, // 휴식시간 유무
                mandatoryTimeExist: false, // 의무시간 유무
            },
            defaultWork: {
                flexibleWorkType: '', // 유연근무 제도
                flexibleWorkName: '', //유연근무명칭
                workDayOfWeekSet: [], //근무요일
                dailyWorkTime: '', // 1일 근로시간
                settlementUnitPeriod: '', // 정산단위기간
                applyDateFrom: new Date(), // 적용시작일자
                startTime: '', // 시작시간
                endTime: '', // 종료시간
                restExist: false, // 휴식시간 유무
                mandatoryTimeExist: false, // 의무시간 유무
            },
            tab: null,
        };
    },
    methods: {
        async getCodeList() {
            let res = await getCodeList();
            if (res.success) {
                this.flexibleWorkTypeList = this.defaultList.concat(res.response.flexibleWorkTypeList);
                this.getFlexibleWorkList();
            }
        },
        closeModal() {
            this.dialog = false;
        },
        async getFlexibleWorkList() {
            this.loading = true;
            const param = {
                ...this.pageable,
                ...this.searchForm,
            };
            let res = await getFlexibleWorkList(param);
            if (res.success) {
                this.flexibleWorkList = res.response.content;
            }
            this.loading = false;
        },
        editFlexibleWork(item) {
            this.flexibleWork = Object.assign({}, item);
            this.dialog = true;
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
