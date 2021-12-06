<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-briefcase</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="px-5 py-15 mt-1 container_card">
            <v-row>
                <v-col cols="12" md="2" sm="6">
                    <v-select label="검색유형" outlined dense class="mt-3"> </v-select>
                </v-col>
                <v-col cols="12" sm="8">
                    <v-text-field
                        width="150"
                        label="검색어"
                        append-icon="mdi-magnify"
                        placeholder="입력하세요."
                        required
                        style="width: 60%; display: inline-block"
                        class="mr-3"
                    />
                    <v-btn color="primary">조회</v-btn>
                </v-col>
                <v-col cols="12" lg="2" class="text-right">
                    <v-dialog v-model="dialog" max-width="900px" persistent>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="error" class="pr-2 mt-3" block v-bind="attrs" v-on="on">
                                출퇴근 허용지역 등록<v-icon right dark> mdi-plus-circle-outline </v-icon>
                            </v-btn>
                        </template>
                        <v-card v-if="dialog">
                            <enable-work-area @close="closeModal" :commuteAreaId="selectedId"></enable-work-area>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
            <v-divider class="my-10" />
            <v-row>
                <v-col cols="12">
                    <v-data-table :headers="headers" :items="commuteAreaList" hide-default-footer class="elevation-1">
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
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import EnableWorkArea from '@/components/flexibleWork/commute/EnableWorkAreaForm.vue';
import { getCommuteAreaList } from '@/api/commuteArea';
export default {
    created() {
        this.getCommuteAreaList();
    },
    components: {
        EnableWorkArea,
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            {
                text: '순번',
                align: 'center',
                sortable: false,
                value: 'commuteAreaId',
            },
            { text: '지점명', value: 'areaName' },
            { text: '주소', value: 'roadName' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        commuteAreaList: [],
        pageable: {
            number: 0,
            size: 10,
        },
        selectedId: 0,
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? '신규 등록' : '출퇴근 지역 수정';
        },
    },

    watch: {
        dialog(val) {
            val || this.close();
        },
    },

    methods: {
        async getCommuteAreaList() {
            let res = await getCommuteAreaList();
            if (res.success) {
                this.commuteAreaList = res.response.content;
            }
        },

        editItem(item) {
            this.selectedId = item.commuteAreaId;
            this.dialog = true;
        },

        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        closeDelete() {
            this.dialogDelete = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem);
            } else {
                this.desserts.push(this.editedItem);
            }
            this.close();
        },
        closeModal() {
            this.dialog = false;
            this.selectedId = 0;
        },
    },
};
</script>

<style></style>
