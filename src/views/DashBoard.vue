<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="5">
                <v-card class="dashboard--card" elevation="5">
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>출퇴근 등록</v-card-title>
                    <v-row class="mt-5">
                        <v-col class="ml-3" cols="4">
                            <v-card color="grey lighten-3 in-card">
                                <v-row justify="center">
                                    <div class="my-3">
                                        <v-avatar :size="100" v-if="ACCOUNT.profileImage">
                                            <v-img :src="ACCOUNT.profileImage"></v-img>
                                        </v-avatar>
                                        <v-avatar :size="100" v-else>
                                            <v-img v-html="identicon"></v-img>
                                        </v-avatar>
                                    </div>
                                </v-row>
                                <v-row justify="center">
                                    <div class="">
                                        <p class="text-subtitle-2 font-weight-bold">
                                            {{ ACCOUNT.userName }} {{ ACCOUNT.position }}
                                        </p>
                                        <p class="text-subtitle-2">{{ ACCOUNT.departmentName }}</p>
                                    </div>
                                </v-row>
                            </v-card>
                        </v-col>
                        <v-col cols="7">
                            <v-card class="in-card">
                                <v-row>
                                    <v-col>
                                        <p>2021-12-01</p>
                                        <p>12:12:35</p>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" md="7">
                <v-card class="dashboard--card" elevation="5">
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>근무현황</v-card-title>
                    <v-row class="d-flex justify-center px-5 mt-2">
                        <v-col cols="6" md="4" lg="3" xl="2">
                            <v-card>
                                <v-toolbar color="purple darken-2" dark dense>
                                    <v-toolbar-title class="text-subtitle-1"> 유연근무제도 </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="text-center">시차출퇴근제</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="6" md="4" lg="3" xl="2">
                            <v-card>
                                <v-toolbar color="purple darken-2" dark dense>
                                    <v-toolbar-title class="text-subtitle-1"> 유연근무명칭 </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="text-center">9시 출근</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="6" md="4" lg="3" xl="2">
                            <v-card>
                                <v-toolbar color="purple darken-2" dark dense>
                                    <v-toolbar-title class="text-subtitle-1"> 계획 근무시간 </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="text-center">184.0</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="6" md="4" lg="3" xl="2">
                            <v-card>
                                <v-toolbar color="purple darken-2" dark dense>
                                    <v-toolbar-title class="text-subtitle-1"> 실 근무시간 </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="text-center">230.3</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="6" md="4" lg="3" xl="2">
                            <v-card>
                                <v-toolbar color="purple darken-2" dark dense>
                                    <v-toolbar-title class="text-subtitle-1"> 평균 근무시간 </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="text-center">46.1</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <v-card class="dashboard--card" elevation="5">
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>바로가기</v-card-title>
                    <div>
                        <v-row class="d-flex justify-space-around px-5 mt-2">
                            <v-card class="mt-5">
                                <v-row justify="center" class="pa-10">
                                    <v-btn icon color="light-blue lighten-1" x-large fab>
                                        <v-icon class="text-h1"> mdi-calendar-arrow-right </v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row justify="center" class="mb-3">
                                    <span>근무계획등록</span>
                                </v-row>
                            </v-card>
                            <v-card class="mt-5">
                                <v-row justify="center" class="pa-10">
                                    <v-btn icon color="light-blue lighten-1" x-large fab>
                                        <v-icon class="text-h1"> mdi-bus-clock </v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row justify="center" class="mb-3">
                                    <span>출/퇴근등록</span>
                                </v-row>
                            </v-card>
                            <v-card class="mt-5">
                                <v-row justify="center" class="pa-10">
                                    <v-btn icon color="light-blue lighten-1" x-large fab>
                                        <v-icon class="text-h1"> mdi-briefcase </v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row justify="center" class="mb-3"> 유연근무유형관리 </v-row>
                            </v-card>
                            <v-card class="mt-5">
                                <v-row justify="center" class="pa-10">
                                    <v-btn icon color="light-blue lighten-1" x-large fab>
                                        <v-icon class="text-h1"> mdi-cog </v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row justify="center" class="mb-3">
                                    <span class="mb-2"> 설정 </span>
                                </v-row>
                            </v-card>
                        </v-row>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" md="7">
                <v-card class="dashboard--card" elevation="5">
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>공지사항</v-card-title>
                    <v-data-table
                        dense
                        :headers="headers"
                        :items="boardList"
                        hide-default-footer
                        class="elevation-0 pa-5"
                    ></v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { toSvg } from 'jdenticon';
export default {
    data() {
        return {
            headers: [
                {
                    text: '순번',
                    align: 'center',
                    width: '80',
                    value: 'id',
                },
                {
                    text: '제목',
                    width: '400',
                    value: 'title',
                },
                {
                    text: '등록일자',
                    width: '100',
                    align: 'center',
                    value: 'createdDt',
                },
            ],
            boardList: [
                {
                    id: 1,
                    title: `LGU+, 아이들나라 전용 놀이펜 '유삐펜'체험 서비스`,
                    createdDt: '2021-07-25',
                },
                {
                    id: 2,
                    title: '나노종합기술원, 국내 첫 12인치 반도체 테스트베드 서비스',
                    createdDt: '2021-06-12',
                },
                {
                    id: 3,
                    title: '삼성디스플레이, 게이밍폰 시장 공략...에이수스에 OLED공급',
                    createdDt: '2021-09-10',
                },
                {
                    id: 4,
                    title: '삼성전자,ITU전파통신부문 GC표준화 회의 의장단 진출',
                    createdDt: '2021-10-10',
                },
                {
                    id: 5,
                    title: '카카오 김범수, 재산기부 서약..."죽기 전까지 절반 이상 사회 환원"',
                    createdDt: '2021-11-16',
                },
            ],
        };
    },
    computed: {
        ...mapGetters(['ACCOUNT']),
        identicon() {
            return toSvg(this.ACCOUNT.userName, 255);
        },
    },
};
</script>

<style scoped>
.dashboard--card {
    min-height: 330px;
}
.col-xl-2 {
    max-width: none !important;
}
.in-card {
    min-height: 200px;
}
</style>
