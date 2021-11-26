<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="5">
                <v-card class="dashboard--card" elevation="5">
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>출퇴근 등록</v-card-title>
                    <v-col class="mx-4">
                        <v-row>
                            <v-avatar :size="100" v-if="ACCOUNT.profileImage">
                                <v-img :src="ACCOUNT.profileImage"></v-img>
                            </v-avatar>
                            <v-avatar :size="100" v-else>
                                <v-img v-html="identicon"></v-img>
                            </v-avatar>
                        </v-row>
                        <v-row>
                            <div class="my-2 text-subtitle-2 text-center">
                                <p>{{ ACCOUNT.userName }} {{ ACCOUNT.position }}</p>
                                <p>{{ ACCOUNT.departmentName }}</p>
                            </div>
                        </v-row>
                    </v-col>
                    <v-col>
                        <v-row> </v-row>
                    </v-col>
                </v-card>
            </v-col>
            <v-col cols="12" md="7">
                <v-card class="dashboard--card" elevation="5">
                    {{ $vuetify.breakpoint.name }}
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
                </v-card>
            </v-col>
            <v-col cols="12" md="7">
                <v-card class="dashboard--card" elevation="5">
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>공지사항</v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { toSvg } from 'jdenticon';
export default {
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
    min-height: 300px;
}
.col-xl-2 {
    max-width: none !important;
}
</style>
