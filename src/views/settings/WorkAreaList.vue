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
                            <enable-work-area @close="closeModal"></enable-work-area>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
            <v-divider class="my-10" />
            <v-row>
                <v-col cols="12">
                    <v-data-table :headers="headers" :items="desserts" hide-default-footer class="elevation-1">
                        <template v-slot:item.actions="{ item }">
                            <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                        </template>
                        <template v-slot:no-data>
                            <v-btn color="primary" @click="initialize"> Reset </v-btn>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import EnableWorkArea from '@/views/settings/EnableWorkArea.vue';
export default {
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
                value: 'id',
            },
            { text: '지점명', value: 'name' },
            { text: '주소', value: 'address' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        desserts: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            name: '',
            address: '',
        },
        defaultItem: {
            id: 0,
            name: '',
            address: '',
        },
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
        dialogDelete(val) {
            val || this.closeDelete();
        },
    },

    created() {
        this.initialize();
    },

    methods: {
        initialize() {
            this.desserts = [
                {
                    id: 1,
                    name: '본사',
                    address: '서울특별시 광진구 동일로22길 91',
                },
                {
                    id: 2,
                    name: 'SCK파견지',
                    address: '서울특별시 강남구 학동로 31길 12(논현동) 벤쳐캐슬',
                },
                {
                    id: 3,
                    name: '스마일게이트',
                    address: '경기도 성남시 분당구 판교역로 220(삼평동) 쏠리드 스페이스 빌딩 5층',
                },
                {
                    id: 4,
                    name: '네이버',
                    address: '경기도 성남시 분당구 정자동 불정로 6 그린팩토리',
                },
                {
                    id: 5,
                    name: 'NC소프트',
                    address: '경기도 성남시 분당구 대왕판교로 644번길 12',
                },
            ];
        },

        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem(item) {
            this.editedIndex = this.desserts.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },

        deleteItemConfirm() {
            this.desserts.splice(this.editedIndex, 1);
            this.closeDelete();
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
        },
    },
};
</script>

<style></style>
