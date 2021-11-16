<template>
    <v-container>
        <v-form ref="flexibleForm" lazy-validation>
            <v-row>
                <v-col>
                    <v-select label="유연근무제도" />
                </v-col>
                <v-col>
                    <v-text-field label="유연근무명칭" />
                </v-col>
            </v-row>
            <v-row>
                <span class="text-subtitle-1 ml-5">근무요일</span>
            </v-row>
            <v-row>
                <v-col v-for="item in workDayOfWeekList" :key="item.code" cols="12" md="1" sm="4" class="mx-3">
                    <v-checkbox :label="getFirstChar(item.title)" :value="item.code"></v-checkbox>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
import { getCodeList } from '@/api/flexibleWork';
export default {
    mounted() {
        this.getCodeList();
    },
    data() {
        return {
            workDayOfWeekList: [],
            flexibleWorkTypeList: [],
            dailyWorkTimeList: [],
            settlementUnitPeriodList: [],
        };
    },
    methods: {
        async getCodeList() {
            let res = await getCodeList();
            if (res.success) {
                this.workDayOfWeekList = res.response.workDayOfWeekList;
            }
        },
        getFirstChar(title) {
            return title.substring(0, 1);
        },
    },
};
</script>

<style></style>
