<template>
    <main class="modal_main">
        <v-toolbar color="modal" dark flat>
            <v-toolbar-title class="pl-5"><v-icon large>mdi-map-legend</v-icon>유연근무 유형 선택</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-divider />

        <section class="modal_section">
            <v-card class="pa-5 container_card">
                <v-item-group mandatory v-model="selectedItem">
                    <v-row class="mt-5">
                        <v-col cols="12" lg="4" sm="3" v-for="(item, idx) in flexibleWorkList" :key="idx">
                            <v-item v-slot="{ active, toggle }">
                                <v-card
                                    class="pa-3 mb-2"
                                    elevation="10"
                                    min-height="385"
                                    :color="active ? 'blue lighten-3' : ''"
                                    @click="toggle"
                                >
                                    <v-scroll-y-transition>
                                        <div v-if="active" class="text-h2 flex-grow-1 text-center"></div>
                                    </v-scroll-y-transition>
                                    <div>
                                        <v-chip :color="item.active ? 'success' : 'secondary'">{{
                                            item.active ? '운영중' : '중단'
                                        }}</v-chip>
                                        <v-spacer />
                                    </div>
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
                                            <span style="color: #64b5f6">{{ item.restExist ? '있음' : '없음' }}</span>
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
                                            <span style="color: #64b5f6">{{
                                                item.mandatoryTimeExist ? '있음' : '없음'
                                            }}</span>
                                            <v-tooltip top>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" v-if="item.mandatoryTimeExist">
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
                            </v-item>
                        </v-col>
                    </v-row>
                </v-item-group>
                <v-divider class="mt-15" />
                <v-card-actions class="mt-5">
                    <v-spacer></v-spacer>
                    <confirm-dialog
                        btnColor="primary"
                        outlined
                        rounded
                        btnText="선택"
                        confirmDetailText="선택하시겠습니까?"
                        @success="choiceFlexibleWork"
                        depressed
                    ></confirm-dialog>
                    <v-btn color="cancel" depressed rounded outlined @click="close"> 취소 </v-btn>
                </v-card-actions>
            </v-card>
        </section>
    </main>
</template>

<script>
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import { getFlexibleWorkListActiveIsTrue } from '@/api/flexibleWork/workType';
export default {
    created() {
        this.getFlexibleWorkList();
    },
    components: {
        ConfirmDialog,
    },
    data() {
        return {
            flexibleWorkList: [],
            selectedItem: {},
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async getFlexibleWorkList() {
            let res = await getFlexibleWorkListActiveIsTrue();
            if (res.success) {
                this.flexibleWorkList = res.response;
            }
        },
        choiceFlexibleWork() {
            console.log(this.selectedItem);
            this.$emit('selectFlexibleWork', this.flexibleWorkList[this.selectedItem]);
        },
    },
};
</script>

<style></style>
