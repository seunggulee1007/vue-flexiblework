<template>
    <v-container>
        <v-toolbar color="secondary" :dark="!isDark" flat>
            <v-icon :dark="!isDark">mdi-briefcase</v-icon>
            <v-toolbar-title class="pl-5" :dark="!isDark">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="px-5 py-15 mt-1 container_card" :dark="isDark" elevation="0">
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
                        @click:append="getFlexibleWorkList"
                        @keyup.enter="getFlexibleWorkList"
                    />
                </v-col>
                <v-col cols="12" lg="3" class="text-right">
                    <v-dialog v-model="dialog" max-width="700px" persistent>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="secondary"
                                outlined
                                :block="$vuetify.breakpoint.name == 'xs'"
                                class="mt-3"
                                v-bind="attrs"
                                v-on="on"
                            >
                                근무유형 등록<v-icon right> mdi-plus-circle-outline </v-icon>
                            </v-btn>
                        </template>
                        <v-card v-if="dialog">
                            <flexible-work-form
                                :flexibleWork="flexibleWork"
                                @close="closeModal"
                                @successSave="successSave"
                            ></flexible-work-form>
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
                    <v-tabs-items v-model="tab" :dark="isDark">
                        <v-tab-item value="tab-1">
                            <v-data-table
                                :items="flexibleWorkList"
                                :headers="headers"
                                hide-default-footer
                                class="elevation-1 mt-5"
                                v-columns-resizable
                                :dark="isDark"
                            >
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
                            <flexible-work-card :flexibleWorkList="flexibleWorkList"></flexible-work-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { getCodeList, getFlexibleWorkList } from '@/api/flexibleWork/workType';
import FlexibleWorkForm from '@/components/flexibleWork/workType/FlexibleWorkForm.vue';
import FlexibleWorkCard from '@/components/flexibleWork/workType/FlexibleWorkCard.vue';
export default {
    mounted() {
        this.getCodeList();
    },
    computed: {
        ...mapGetters(['isDark']),
    },
    components: {
        FlexibleWorkForm,
        FlexibleWorkCard,
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
                restTime: '',
                active: true, //사용여부
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
                restTime: '',
                active: true, //사용여부
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
        successSave() {
            this.closeModal();
            this.getFlexibleWorkList();
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
