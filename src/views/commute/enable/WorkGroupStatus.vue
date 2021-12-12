<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-briefcase</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="px-5 py-15 mt-1 container_card" elevation="0">
            <v-row
                ><v-col cols="12" md="2" sm="6">
                    <v-select
                        label="검색유형"
                        v-model="searchForm.searchKind"
                        outlined
                        dense
                        class="mt-3"
                        :items="[
                            { title: '출퇴근그룹명', code: '1' },
                            { title: '출퇴근지역명', code: '2' },
                        ]"
                        item-text="title"
                        item-value="code"
                    >
                    </v-select>
                </v-col>
                <v-col cols="12" sm="7">
                    <v-text-field
                        width="150"
                        label="검색어"
                        append-icon="mdi-magnify"
                        placeholder="입력하세요."
                        required
                        style="width: 60%; display: inline-block"
                        class="mr-3"
                        v-model="searchForm.searchKeyword"
                        @click:append="getCommuteGroupList"
                        @keyup.enter="getCommuteGroupList"
                    />
                </v-col>
                <v-col cols="12" lg="3" class="text-right">
                    <v-dialog v-model="dialog" max-width="900px" persistent>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="secondary"
                                :block="$vuetify.breakpoint.name == 'xs'"
                                outlined
                                class="mt-3"
                                v-bind="attrs"
                                v-on="on"
                            >
                                출퇴근 그룹 등록<v-icon right> mdi-plus-circle-outline </v-icon>
                            </v-btn>
                        </template>
                        <v-card v-if="dialog">
                            <register-work-group-form
                                @close="closeModal"
                                :commuteGroupId="selectedId"
                            ></register-work-group-form>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
            <v-divider class="my-10" />
            <v-row>
                <v-col cols="12">
                    <v-col cols="12">
                        <v-data-table
                            :headers="headers"
                            :items="commuteGroupList"
                            hide-default-footer
                            class="elevation-1"
                        >
                            <template v-slot:item.roadName="{ item }">
                                {{ `${item.roadName} ${item.detailAddress}` }}
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                            </template>
                            <template v-slot:no-data>
                                <span>조회된 결과가 없습니다.</span>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import RegisterWorkGroupForm from '@/components/flexibleWork/commute/RegisterWorkGroupForm.vue';
import { getCommuteGroupList } from '@/api/commute/commuteGroup';
export default {
    mounted() {
        this.getCommuteGroupList();
    },
    components: {
        RegisterWorkGroupForm,
    },
    data() {
        return {
            dialog: false,
            commuteGroupList: [],
            selectedId: 0,
            headers: [
                {
                    text: '순번',
                    align: 'center',
                    sortable: false,
                    value: 'commuteGroupId',
                },
                { text: '그룹명', value: 'groupName' },
                { text: '허용지역명', value: 'areaName' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            searchForm: {
                searchKind: '',
                searchKeyword: '',
            },
            pageable: {
                number: 0,
                size: 10,
            },
        };
    },
    methods: {
        closeModal() {
            this.dialog = false;
        },
        async getCommuteGroupList() {
            const param = {
                ...this.pageable,
                ...this.searchForm,
            };
            let res = await getCommuteGroupList(param);
            if (res.success) {
                this.commuteGroupList = res.response.content;
            }
        },
        editItem(item) {
            console.log(item);
        },
    },
};
</script>

<style></style>
