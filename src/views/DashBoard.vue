<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="5">
                <v-card>
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
                <v-card>
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>근무현황</v-card-title>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <v-card>
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>바로가기</v-card-title>
                </v-card>
            </v-col>
            <v-col cols="12" md="7">
                <v-card>
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
.v-sheet--offset {
    top: -24px;
    position: relative;
}
</style>
