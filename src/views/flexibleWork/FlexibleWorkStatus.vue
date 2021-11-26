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
                <v-col cols="12" sm="8">
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
                    <v-data-table
                        :items="flexibleWorkList"
                        :headers="headers"
                        hide-default-footer
                        class="elevation-1"
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
                        <template v-slot:item.workTime="{ item }"> {{ item.startTime }} ~ {{ item.endTime }} </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { getCodeList, getFlexibleWorkList } from '@/api/flexibleWork';
import RegisterFlexibleWorkForm from '@/components/flexibleWork/RegisterFlexibleWorkForm.vue';
export default {
    async mounted() {
        await this.getCodeList();
        await this.getFlexibleWorkList();
    },
    components: {
        RegisterFlexibleWorkForm,
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
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '유연근무명칭',
                    value: 'flexibleWorkName',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '1일 근로 시간',
                    value: 'dailyWorkTime',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '근무요일',
                    value: 'workDayOfWeek',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '정산단위기간',
                    value: 'settlementUnitPeriod',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '휴게시간우뮤',
                    value: 'restExist',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '의무시간유무',
                    value: 'mandatoryTimeExist',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '근무시간',
                    value: 'workTime',
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
                    value: 'applyDateFrom',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '종료일',
                    value: 'applyDateTo',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
                },
                {
                    text: '사용유무',
                    value: 'active',
                    align: 'center',
                    sortable: false,
                    divider: true,
                    class: 'grey darken-1 white--text',
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
        };
    },
    methods: {
        async getCodeList() {
            let res = await getCodeList();
            if (res.success) {
                this.flexibleWorkTypeList = this.defaultList.concat(res.response.flexibleWorkTypeList);
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
            console.log(res);
            if (res.success) {
                this.flexibleWorkList = res.response.content;
            }
            this.loading = false;
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
