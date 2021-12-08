<template>
    <main class="modal_container">
        <v-toolbar color="purple darken-2" dark flat>
            <v-toolbar-title class="pl-5">유연근무 유형 등록</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <section class="modal_section">
            <v-card :loading="loading">
                <v-form ref="flexibleForm" v-model="valid" lazy-validation class="pa-10">
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
                            <v-text-field
                                label="유연근무명칭"
                                :rules="[v => !!v || '유연근무명칭을 입력해 주세요.']"
                                v-model="flexibleWork.flexibleWorkName"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <span class="text-caption ml-3 pb-3">근무요일</span>
                    </v-row>
                    <v-divider />
                    <v-row>
                        <v-col v-for="item in workDayOfWeekList" :key="item.code" cols="12" md="1" sm="3" class="mx-3">
                            <v-checkbox
                                :label="item.title"
                                :value="item.code"
                                v-model="flexibleWork.workDayOfWeekSet"
                                style="margin-bottom: -40px"
                            ></v-checkbox>
                        </v-col>
                    </v-row>
                    <v-divider class="pb-3 mt-10" />
                    <v-row justify="space-between">
                        <v-col cols="12">
                            <v-select
                                label="1일 근로시간"
                                :items="dailyWorkTimeList"
                                item-text="title"
                                item-value="code"
                                v-model="flexibleWork.dailyWorkTime"
                            />
                        </v-col>
                        <v-col cols="12">
                            <v-select
                                label="정산단위기간"
                                :items="settlementUnitPeriodList"
                                item-text="title"
                                item-value="code"
                                v-model="flexibleWork.settlementUnitPeriod"
                            />
                        </v-col>
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
                                    :rules="[v => !!v || '시작시간을 선택해 주세요.']"
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
                                    :rules="[v => !!v || '종료시간을 선택해 주세요.']"
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
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-switch
                                v-model="flexibleWork.restExist"
                                label="휴게시간 유무"
                                color="red"
                                hide-details
                            ></v-switch>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-switch
                                v-model="flexibleWork.mandatoryTimeExist"
                                label="의무시간 유무"
                                color="red"
                                hide-details
                            ></v-switch>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-expansion-panels v-model="panel" focusable multiple>
                                <v-expansion-panel v-if="flexibleWork.restExist">
                                    <v-expansion-panel-header>휴게시간</v-expansion-panel-header>
                                    <v-divider />
                                    <v-expansion-panel-content>
                                        <v-data-table
                                            :headers="headers"
                                            :items="restTimeList"
                                            hide-default-footer
                                            class="elevation-1"
                                        >
                                            <template v-slot:top>
                                                <div class="text-right my-3">
                                                    <v-btn color="info" @click="addRestTimeList">
                                                        <v-icon left dark> mdi-plus-circle-outline </v-icon>추가
                                                    </v-btn>
                                                </div>
                                            </template>
                                            <template v-slot:item.startTime="{ item }">
                                                <v-menu
                                                    :ref="`restStart${item.id}`"
                                                    v-model="item.menu"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    :return-value.sync="item.startTime"
                                                    transition="scale-transition"
                                                    offset-y
                                                    max-width="290px"
                                                    min-width="290px"
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="item.startTime"
                                                            label="시작"
                                                            prepend-icon="mdi-clock-time-four-outline"
                                                            :rules="[v => !!v || '시작시간을 선택해 주세요.']"
                                                            readonly
                                                            v-bind="attrs"
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-time-picker
                                                        locale="ko"
                                                        v-if="item.menu"
                                                        v-model="item.startTime"
                                                        full-width
                                                        @click:minute="
                                                            $refs[`restStart${item.id}`].save(item.startTime)
                                                        "
                                                    ></v-time-picker>
                                                </v-menu>
                                            </template>
                                            <v-divider></v-divider>
                                            <template v-slot:item.endTime="{ item }">
                                                <v-menu
                                                    :ref="`restEnd${item.id}`"
                                                    v-model="item.menu2"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    :return-value.sync="item.endTime"
                                                    transition="scale-transition"
                                                    offset-y
                                                    max-width="290px"
                                                    min-width="290px"
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="item.endTime"
                                                            label="종료"
                                                            prepend-icon="mdi-clock-time-four-outline"
                                                            readonly
                                                            :rules="[v => !!v || '종료시간을 선택해 주세요.']"
                                                            v-bind="attrs"
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-time-picker
                                                        locale="ko"
                                                        v-if="item.menu2"
                                                        v-model="item.endTime"
                                                        full-width
                                                        @click:minute="$refs[`restEnd${item.id}`].save(item.endTime)"
                                                    ></v-time-picker>
                                                </v-menu>
                                            </template>
                                            <template v-slot:item.actions="{ item }">
                                                <v-icon small @click="deleteRestItem(item)" v-if="item.id > 1">
                                                    mdi-delete
                                                </v-icon>
                                            </template>
                                        </v-data-table>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                                <v-expansion-panel v-if="flexibleWork.mandatoryTimeExist">
                                    <v-expansion-panel-header>의무시간</v-expansion-panel-header>
                                    <v-divider />
                                    <v-expansion-panel-content>
                                        <v-data-table
                                            :headers="headers"
                                            :items="mandatoryTimeList"
                                            hide-default-footer
                                            class="elevation-1"
                                        >
                                            <template v-slot:top>
                                                <div class="text-right my-3">
                                                    <v-btn color="info" @click="addMandatoryTimeList">
                                                        <v-icon left dark> mdi-plus-circle-outline </v-icon>추가
                                                    </v-btn>
                                                </div>
                                            </template>
                                            <template v-slot:item.startTime="{ item }">
                                                <v-menu
                                                    :ref="`mandatoryStart${item.id}`"
                                                    v-model="item.menu"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    :return-value.sync="item.startTime"
                                                    transition="scale-transition"
                                                    offset-y
                                                    max-width="290px"
                                                    min-width="290px"
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="item.startTime"
                                                            label="시작"
                                                            prepend-icon="mdi-clock-time-four-outline"
                                                            :rules="[v => !!v || '시작시간을 선택해 주세요.']"
                                                            readonly
                                                            v-bind="attrs"
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-time-picker
                                                        locale="ko"
                                                        v-if="item.menu"
                                                        v-model="item.startTime"
                                                        full-width
                                                        @click:minute="
                                                            $refs[`mandatoryStart${item.id}`].save(item.startTime)
                                                        "
                                                    ></v-time-picker>
                                                </v-menu>
                                            </template>
                                            <template v-slot:item.endTime="{ item }">
                                                <v-menu
                                                    :ref="`mandatoryEnd${item.id}`"
                                                    v-model="item.menu2"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    :return-value.sync="item.endTime"
                                                    transition="scale-transition"
                                                    offset-y
                                                    max-width="290px"
                                                    min-width="290px"
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="item.endTime"
                                                            label="종료"
                                                            prepend-icon="mdi-clock-time-four-outline"
                                                            :rules="[v => !!v || '종료시간을 선택해 주세요.']"
                                                            readonly
                                                            v-bind="attrs"
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-time-picker
                                                        locale="ko"
                                                        v-if="item.menu2"
                                                        v-model="item.endTime"
                                                        full-width
                                                        @click:minute="
                                                            $refs[`mandatoryEnd${item.id}`].save(item.endTime)
                                                        "
                                                    ></v-time-picker>
                                                </v-menu>
                                            </template>
                                            <template v-slot:item.actions="{ item }">
                                                <v-icon small @click="deleteMandatoryItem(item)" v-if="item.id > 1">
                                                    mdi-delete
                                                </v-icon>
                                            </template>
                                        </v-data-table>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-col>
                    </v-row>
                </v-form>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <confirm-dialog
                        :btnColor="'primary'"
                        :outlined="true"
                        :rounded="true"
                        btnText="등록"
                        confirmDetailText="등록하시겠습니까?"
                        @success="saveFlexibleWork"
                        :depressed="true"
                        :disabled="!valid"
                    ></confirm-dialog>
                    <v-btn color="warning" depressed rounded outlined @click="close"> 취소 </v-btn>
                </v-card-actions>
            </v-card>
        </section>
    </main>
</template>

<script>
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import { getCodeList, saveFlexibleWork } from '@/api/flexibleWork';
export default {
    props: ['flexibleWork'],
    mounted() {
        this.getCodeList();
    },
    components: {
        ConfirmDialog,
    },
    data() {
        return {
            loading: false,
            valid: false,
            menu: false,
            menu2: false,
            workDayOfWeekList: [],
            flexibleWorkTypeList: [],
            dailyWorkTimeList: [],
            settlementUnitPeriodList: [],
            restTimeList: [{ id: 1, startTime: '', endTime: '', menu: false, menu2: false }],
            mandatoryTimeList: [{ id: 1, startTime: '', endTime: '', menu: false, menu2: false }],
            headers: [
                {
                    text: '번호',
                    align: 'center',
                    sortable: false,
                    class: 'grey darken-1 white--text',
                    divider: true,
                    value: 'id',
                },
                {
                    text: '시작시간',
                    align: 'center',
                    sortable: false,
                    class: 'grey darken-1 white--text',
                    width: '150',
                    divider: true,
                    value: 'startTime',
                },
                {
                    text: '종료시간',
                    align: 'center',
                    sortable: false,
                    width: '150',
                    class: 'grey darken-1 white--text',
                    value: 'endTime',
                },
                {
                    text: '비고',
                    align: 'center',
                    value: 'actions',
                    class: 'grey darken-1 white--text',
                    sortable: false,
                },
            ],
            panel: [0, 1],
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
        async saveFlexibleWork() {
            if (this.$refs.flexibleForm.validate()) {
                this.loading = true;
                if (this.flexibleWork.restExist) {
                    this.flexibleWork.restTimeList = this.restTimeList;
                }
                if (this.flexibleWork.mandatoryTimeExist) {
                    this.flexibleWork.mandatoryTimeList = this.mandatoryTimeList;
                }
                let res = await saveFlexibleWork(this.flexibleWork);
                if (res.success) {
                    this.close();
                }
                this.loading = false;
            }
        },
        addRestTimeList() {
            this.restTimeList.push({
                id: this.restTimeList.length + 1,
                startTime: '',
                endTime: '',
                menu: false,
                menu2: false,
            });
        },
        addMandatoryTimeList() {
            this.mandatoryTimeList.push({
                id: this.mandatoryTimeList.length + 1,
                startTime: '',
                endTime: '',
                menu: false,
                menu2: false,
            });
        },
        close() {
            this.$emit('close');
        },
        saveStartTime(item) {
            this.$refs[`restStart${item.id}`].save(item.startTime);
        },
        deleteRestItem(item) {
            let idx = this.restTimeList.indexOf(item);
            if (idx != -1) {
                this.restTimeList.splice(idx, 1);
            }
        },
        deleteMandatoryItem(item) {
            let idx = this.mandatoryTimeList.indexOf(item);
            if (idx != -1) {
                this.mandatoryTimeList.splice(idx, 1);
            }
        },
    },
};
</script>

<style></style>
