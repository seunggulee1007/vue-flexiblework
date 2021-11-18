<template>
    <div>
        <v-toolbar color="purple darken-2" dark flat>
            <v-toolbar-title class="pl-5">유연근무 유형 등록</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container>
            <v-card class="pa-10">
                <v-form ref="flexibleForm" lazy-validation>
                    <v-row justify="space-between">
                        <v-col>
                            <v-select
                                label="유연근무제도"
                                :items="flexibleWorkTypeList"
                                v-model="flexibleWork.flexibleWorkType"
                                item-text="title"
                                item-value="code"
                            />
                        </v-col>
                        <v-col>
                            <v-text-field label="유연근무명칭" v-model="flexibleWork.flexibleWorkName" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <span class="text-subtitle-1 ml-5">근무요일</span>
                    </v-row>
                    <v-row>
                        <v-col v-for="item in workDayOfWeekList" :key="item.code" cols="12" md="1" sm="4" class="mx-3">
                            <v-checkbox
                                :label="getFirstChar(item.title)"
                                :value="item.code"
                                v-model="flexibleWork.workDayOfWeekSet"
                            ></v-checkbox>
                        </v-col>
                    </v-row>
                    <v-row justify="space-between">
                        <v-col>
                            <v-select
                                label="1일 근로시간"
                                :items="dailyWorkTimeList"
                                item-text="title"
                                item-value="code"
                                v-model="flexibleWork.dailyWorkTime"
                            />
                        </v-col>
                        <v-col>
                            <v-select
                                label="정산단위기간"
                                :items="settlementUnitPeriodList"
                                item-text="title"
                                item-value="code"
                                v-model="flexibleWork.settlementUnitPeriod"
                            />
                        </v-col>
                    </v-row>
                    <v-row justify="space-between">
                        <v-switch
                            v-model="flexibleWork.restExist"
                            label="휴게시간 유무"
                            color="red"
                            value="red"
                            hide-details
                        ></v-switch>
                        <v-switch
                            v-model="flexibleWork.mandatoryTimeExist"
                            label="의무시간 유무"
                            color="red"
                            value="red"
                            hide-details
                        ></v-switch>
                    </v-row>
                    <v-row>
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="flexibleWork.startTime"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="flexibleWork.startTime"
                                    label="시작시간"
                                    prepend-icon="mdi-clock-time-four-outline"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-time-picker
                                v-if="menu"
                                v-model="flexibleWork.startTime"
                                full-width
                                @click:minute="$refs.menu.save(flexibleWork.startTime)"
                            ></v-time-picker>
                        </v-menu>
                        <v-menu
                            ref="menu2"
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="flexibleWork.endTime"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="flexibleWork.endTime"
                                    label="종료시간"
                                    prepend-icon="mdi-clock-time-four-outline"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-time-picker
                                locale="ko"
                                v-if="menu2"
                                v-model="flexibleWork.endTime"
                                full-width
                                @click:minute="$refs.menu2.save(flexibleWork.endTime)"
                            ></v-time-picker>
                        </v-menu>
                    </v-row>
                </v-form>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text> 취소 </v-btn>
                    <v-btn color="blue darken-1" text @click="test"> 등록 </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import { getCodeList, saveFlexibleWork } from '@/api/flexibleWork';
export default {
    mounted() {
        this.getCodeList();
    },
    data() {
        return {
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
            menu: false,
            menu2: false,
            workDayOfWeekList: [],
            flexibleWorkTypeList: [],
            dailyWorkTimeList: [],
            settlementUnitPeriodList: [],
            restTimeList: [{ id: 0, startTime: '', endTime: '', menu: false }],
            mandatoryTimeList: [{ id: 0, startTime: '', endTime: '', menu: false }],
        };
    },
    methods: {
        async getCodeList() {
            let res = await getCodeList();
            if (res.success) {
                this.workDayOfWeekList = res.response.workDayOfWeekList;
                this.flexibleWorkTypeList = res.response.flexibleWorkTypeList;
                this.dailyWorkTimeList = res.response.dailyWorkTimeList;
                this.settlementUnitPeriodList = res.response.settlementUnitPeriodList;
                this.setDefaultValue();
            }
        },
        setDefaultValue() {
            this.flexibleWorkTypeList.filter(data => {
                if (data.default) {
                    this.flexibleWork.flexibleWorkType = data.code;
                }
            });
            this.dailyWorkTimeList.filter(data => {
                if (data.default) {
                    this.flexibleWork.dailyWorkTime = data.code;
                }
            });
            this.settlementUnitPeriodList.filter(data => {
                if (data.default) {
                    this.flexibleWork.settlementUnitPeriod = data.code;
                }
            });
        },
        getFirstChar(title) {
            return title.substring(0, 1);
        },
        test() {
            console.log(this.flexibleWork);
            saveFlexibleWork(this.flexibleWork);
        },
        addRestTimeList() {
            this.restTimeList.push({ id: this.restTimeList.length, startTime: '', endTime: '', menu: false });
        },
        addMandatoryTimeList() {
            this.mandatoryTimeList.push({ id: this.mandatoryTimeList.length, startTime: '', endTime: '', menu: false });
        },
        close() {
            this.$emit('close');
        },
    },
};
</script>

<style></style>
