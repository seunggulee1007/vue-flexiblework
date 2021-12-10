<template>
    <v-row class="mt-5">
        <v-col cols="12" md="3" sm="4" v-for="(item, idx) in flexibleWorkList" :key="idx">
            <v-card class="pa-3 mb-2" elevation="10" min-height="385">
                <v-toolbar elevation="0">
                    <v-chip :color="item.active ? 'success' : 'secondary'">{{
                        item.active ? '운영중' : '중단'
                    }}</v-chip>
                    <v-spacer />
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-cog-outline</v-icon></v-btn>
                        </template>
                        <div>
                            <span>수정</span>
                        </div>
                    </v-tooltip>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark v-bind="attrs" v-on="on" icon>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item v-for="(menu, index) in menus" :key="index">
                                <v-list-item-title>
                                    <v-btn text @click="menu.event(item)">{{ menu.name }}</v-btn>
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
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
                        <span style="color: #64b5f6">{{ `${item.applyDateFrom} ~ ${item.applyDateTo} ` }}</span>
                    </div>
                    <div class="text-caption">
                        <v-icon small class="mr-1">mdi-coffee-outline </v-icon>휴게시간
                        <span style="color: #64b5f6">{{ item.restExist ? '있음' : '없음' }}</span>
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on" v-if="item.restExist">
                                    <v-icon color="grey lighten-1" small> mdi-information-outline </v-icon>
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
                    </div>
                    <div class="text-caption">
                        <v-icon small class="mr-1">mdi-account-lock-outline </v-icon>의무시간
                        <span style="color: #64b5f6">{{ item.mandatoryTimeExist ? '있음' : '없음' }}</span>
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on" v-if="item.mandatoryTimeExist">
                                    <v-icon color="grey lighten-1" small> mdi-information-outline </v-icon>
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
                    </div>
                    <div class="text-caption">
                        <v-icon small class="mr-1">mdi-account-group</v-icon>근무자
                        <span style="color: #64b5f6">{{ item.workPersonCnt }}</span> 명
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: ['flexibleWorkList'],
    data() {
        return {
            menus: [
                {
                    name: '구성원 등록',
                    event: this.addMember,
                },
            ],
        };
    },
    methods: {
        addMember(item) {
            console.log(item);
        },
    },
};
</script>

<style></style>
