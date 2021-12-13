<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-briefcase-account</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="container_card" elevation="0">
            <v-row>
                <v-col cols="12" md="6">
                    <v-container>
                        <v-card-title>메뉴</v-card-title>
                        <v-divider></v-divider>
                        <v-card class="mx-auto mt-5" max-width="500">
                            <v-sheet class="pa-4 primary lighten-2">
                                <v-text-field
                                    v-model="search"
                                    label="메뉴를 검색해주세요."
                                    open-on-click
                                    activatable
                                    dark
                                    flat
                                    hide-details
                                    clearable
                                    clear-icon="mdi-close-circle-outline"
                                ></v-text-field>
                            </v-sheet>
                            <v-card-text>
                                <v-treeview
                                    :items="menuList"
                                    :search="search"
                                    :filter="filter"
                                    :open.sync="open"
                                    item-text="menuName"
                                    item-key="menuId"
                                    color="warning"
                                    open-on-click
                                    transition
                                    item-children="children"
                                >
                                    <template v-slot:append="{ item }">
                                        <v-btn
                                            @click="selectItem(item, $event)"
                                            small
                                            outlined
                                            depressed
                                            color="primary"
                                        >
                                            선택</v-btn
                                        >
                                    </template>
                                </v-treeview>
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="12" md="5" class="d-flex text-center">
                    <v-container v-if="!selected.menuName">
                        <div>메뉴를 선택해 주세요</div>
                    </v-container>
                    <v-container v-else>
                        <v-card elevation="0">
                            <v-card-text>{{ selected.menuName }}</v-card-text>
                            <v-data-table
                                :headers="headers"
                                :items="groupList"
                                hide-default-footer
                                class="elevation-1"
                                :loading="groupLoading"
                            >
                                <template v-slot:item.menuRole="{ item }">
                                    <v-btn :color="menuRole(item)" outlined @click="changeRole(item)">{{
                                        item.menuRole || 'NONE'
                                    }}</v-btn>
                                </template>
                            </v-data-table>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn>저장</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-container>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { getMenuList } from '@/api/admin/menu';
import { getAuthorityGroupByMenuId } from '@/api/admin/authorityMenu';
import { MENU_ROLE } from '@/enums';
export default {
    created() {
        this.getMenuList();
    },
    data() {
        return {
            menuList: [],
            search: null,
            open: [],
            selected: {},
            groupList: [],
            groupLoading: false,
            headers: [
                {
                    text: '아이디',
                    value: 'authorityGroupId',
                    sortable: false,
                    align: 'center',
                },
                {
                    text: '그룹명',
                    value: 'authorityGroupName',
                    sortable: false,
                    align: 'center',
                },
                {
                    text: '권한',
                    value: 'menuRole',
                    sortable: false,
                    align: 'center',
                },
            ],
        };
    },
    computed: {
        filter() {
            return undefined;
        },
    },
    methods: {
        async getMenuList() {
            let res = await getMenuList();
            if (res.success) {
                this.menuList = res.response;
            }
        },
        selectItem(item, e) {
            e.stopPropagation();
            this.selected = item;
            this.getAuthorityGroupByMenuId(item.menuId);
        },
        async getAuthorityGroupByMenuId(menuId) {
            this.groupList = [];
            this.groupLoading = true;
            const res = await getAuthorityGroupByMenuId(menuId);
            console.log(res);
            if (res.success) {
                this.groupList = res.response;
            }
            this.groupLoading = false;
        },
        menuRole(item) {
            console.log(item.menuRole);
            switch (item.menuRole) {
                case MENU_ROLE.read:
                    return 'secondary';
                case MENU_ROLE.write:
                    return 'success';
                default:
                    return 'error';
            }
        },
        changeRole(item) {
            switch (item.menuRole) {
                case MENU_ROLE.read:
                    item.menuRole = MENU_ROLE.write;
                    break;
                case MENU_ROLE.write:
                    item.menuRole = MENU_ROLE.none;
                    break;
                default:
                    item.menuRole = MENU_ROLE.read;
            }
        },
    },
};
</script>

<style></style>
