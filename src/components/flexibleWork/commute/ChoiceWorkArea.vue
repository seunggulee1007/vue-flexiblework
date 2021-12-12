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
                        <v-col cols="12" lg="4" sm="3" v-for="(item, idx) in commuteAreaList" :key="idx">
                            <v-item v-slot="{ active, toggle }">
                                <v-card
                                    class="pa-3 mb-2"
                                    elevation="10"
                                    min-height="200"
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
                                    <v-card-title>{{ item.areaName }}</v-card-title>
                                    <v-card-text>
                                        <v-row no-gutters>
                                            <v-col>
                                                <v-chip small class="mr-1">{{ item.distance }}m</v-chip>
                                                <v-chip small class="mr-1">{{ item.city }}</v-chip>
                                                <v-chip small class="mr-1">{{ item.siGunGu }}</v-chip>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="text-caption">
                                                <v-icon small class="mr-1">mdi-calendar-month</v-icon>주소
                                                <span style="color: #64b5f6">{{
                                                    `${item.roadName} ${item.detailAddress}`
                                                }}</span>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col> </v-col>
                                        </v-row>
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
                        @success="choiceCommuteArea"
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
import { getCommuteAreaListByActiveIsTrue } from '@/api/commute/commuteArea';
export default {
    created() {
        this.getCommuteAreaList();
    },
    components: {
        ConfirmDialog,
    },
    data() {
        return {
            commuteAreaList: [],
            selectedItem: {},
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async getCommuteAreaList() {
            let res = await getCommuteAreaListByActiveIsTrue();
            console.log(res);
            if (res.success) {
                this.commuteAreaList = res.response;
            }
        },
        choiceCommuteArea() {
            console.log(this.selectedItem);
            this.$emit('selectCommuteArea', this.commuteAreaList[this.selectedItem]);
        },
    },
};
</script>

<style></style>
