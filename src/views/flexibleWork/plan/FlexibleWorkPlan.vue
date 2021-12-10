<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-calendar-month-outline</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="px-5 py-15 mt-1 container_card">
            <v-row>
                <v-col cols="12">
                    <v-card elevation="0">
                        <v-row>
                            <v-col cols="2">
                                <span class="text-h3 pa-5">{{ planData.month }}월</span>
                            </v-col>
                            <v-divider vertical></v-divider>

                            <v-col>
                                <v-row>
                                    <v-col>
                                        <span class="text-h5 ml-2">{{ planData.year }}</span>
                                    </v-col>
                                </v-row>
                                <v-row no-gutters>
                                    <v-col>
                                        <v-btn fab text small color="grey darken-2" @click="prev">
                                            <v-icon small> mdi-chevron-left </v-icon>
                                        </v-btn>
                                        <span>{{ planData.week }}</span>
                                        <v-btn fab text small color="grey darken-2" @click="next"
                                            ><v-icon small> mdi-chevron-right </v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-row>
                            <v-col cols="12" md="8">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-card min-height="130" class="pa-3 ml-5" elevation="0">
                                            <p class="text-subtitle-1">
                                                총 예정 근무 <v-chip color="success">good</v-chip>
                                            </p>
                                            <span class="text-h3">35.2시간</span>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-card min-height="130" class="mt-3" elevation="0">
                                            <v-row>
                                                <v-col>
                                                    <p class="text-subtitle-1">근무상세</p>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col class="text-h5"> <v-icon></v-icon> 35 시간 </v-col>
                                                <v-col><v-icon></v-icon>0.5 시간</v-col>
                                            </v-row>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-card class="ml-5 mb-3">
                                            <v-progress-linear
                                                value="65"
                                                striped
                                                height="10"
                                                color="lime"
                                            ></v-progress-linear>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="4"> </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class="mt-10">
                <v-divider />
                <v-col cols="12">
                    <v-card>
                        <v-expansion-panels focusable>
                            <v-expansion-panel v-for="(item, i) in planData.planList" :key="i">
                                <v-expansion-panel-header>
                                    <span>{{ item.planDay }} {{ `(${item.dayOfWeek})` }}</span>
                                    <span>
                                        <v-icon class="mr-3">mdi-account-circle</v-icon>
                                        <v-chip>근무</v-chip>
                                        {{ `${item.startTime} ~ ${item.endTime}` }}
                                    </span>
                                    <v-spacer />
                                    <span><v-progress-linear value="65"></v-progress-linear></span>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-card> </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { FLEXIBLE_WORK_TYPE } from '@/enums';
import { getWorkPlan } from '@/api/flexibleWork/plan';
export default {
    mounted() {
        this.getWorkPlan();
    },
    data() {
        return {
            planData: {
                year: '',
                month: '',
                week: '',
                weekCnt: '',
                defaultStartTime: '',
                defaultEndTime: '',
                dailyWorkTime: 0,
                mandatoryTimeList: [],
                restTimeList: [],
            },
            planList: [],
        };
    },
    methods: {
        async getWorkPlan() {
            let res = await getWorkPlan();
            this.planData = res.response;
            if (res.response.flexibleWorkType == FLEXIBLE_WORK_TYPE.week52) {
                console.log('주 52시간이래');
            }
        },
        prev() {},
        next() {},
    },
};
</script>

<style></style>
