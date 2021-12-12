<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-account-wrench</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="px-5 py-15 mt-1 container_card">
            <v-row>
                <v-col cols="12" md="2" sm="6">
                    <v-select
                        :items="[
                            { title: '전체', code: '' },
                            { title: '권한그룹명', code: '1' },
                        ]"
                        item-text="title"
                        item-value="code"
                        label="검색조건 선택"
                        outlined
                        dense
                        class="mt-3"
                        v-model="searchForm.searchKind"
                    >
                    </v-select>
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
                        v-model="searchForm.searchKeyword"
                        @click:append="getAuthorityGroupList"
                        @keyup.enter="getAuthorityGroupList"
                    />
                </v-col>
                <v-col cols="12" lg="2" class="text-right">
                    <v-dialog v-model="dialog" max-width="700px" persistent>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="secondary"
                                outlined
                                :block="$vuetify.breakpoint.name == 'xs'"
                                class="mt-3"
                                v-bind="attrs"
                                v-on="on"
                            >
                                권한그룹 등록<v-icon right dark> mdi-plus-circle-outline </v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <authority-group-form
                                v-if="dialog"
                                :originAuthorityGroup="authorityGroup"
                                @close="closeModal"
                            ></authority-group-form>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
            <v-divider class="my-10" />
            <v-row>
                <v-col cols="12">
                    <v-data-table
                        :items="authorityGroupList"
                        :headers="headers"
                        hide-default-footer
                        class="elevation-1"
                        v-columns-resizable
                        :loading="loading"
                        loading-text="데이터를 조회 중입니다."
                    >
                        <template v-slot:item.actions="{ item }">
                            <v-icon small class="mr-2" @click="editAuthorityGroup(item)"> mdi-pencil </v-icon>
                            <!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import AuthorityGroupForm from '@/components/admin/auth/AuthorityGroupForm.vue';
import { getAuthorityGroupList } from '@/api/admin/authorityGroup';
export default {
    created() {
        this.getAuthorityGroupList();
    },
    components: {
        AuthorityGroupForm,
    },
    data() {
        return {
            headers: [
                {
                    text: '권한 그룹 아이디',
                    value: 'authorityGroupId',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '권한그룹명',
                    value: 'authorityGroupName',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '사용여부',
                    value: 'active',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '그룹 사원 수',
                    value: 'groupMemberCnt',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
                {
                    text: '수정',
                    value: 'actions',
                    align: 'center',
                    sortable: false,
                    divider: true,
                },
            ],
            searchForm: {
                searchKind: '',
                searchKeyword: '',
            },
            authorityGroup: {
                authorityGroupName: '',
                basic: false,
                active: true,
                admin: false,
            },
            defaultGroup: {
                authorityGroupName: '',
                basic: false,
                active: true,
                admin: false,
            },
            dialog: false,
            authorityGroupList: [],
            loading: true,
        };
    },
    methods: {
        async getAuthorityGroupList() {
            this.loading = true;
            const param = {
                searchKind: '',
                searchKeyword: '',
            };
            let res = await getAuthorityGroupList(param);
            if (res.success) {
                this.authorityGroupList = res.response.content;
            }
            this.loading = false;
        },
        closeModal() {
            this.dialog = false;
            this.authorityGroup = Object.assign({}, this.defaultGroup);
        },
        editAuthorityGroup(item) {
            this.dialog = true;
            this.authorityGroup = item;
        },
    },
};
</script>

<style></style>
