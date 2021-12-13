<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-briefcase</v-icon>
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
                                    label="Search Company Directory"
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
                                        <v-btn @click="selectItem(item, $event)" small color="secondary" outlined>
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
                    <v-scroll-y-transition mode="out-in">
                        <v-container v-if="selected.menuId">
                            <v-card-title>{{ selected.menuName }}</v-card-title>
                            <v-divider />
                            <v-form v-model="valid" lazy-validation ref="form" class="my-5">
                                <v-text-field
                                    v-model="selected.menuName"
                                    :rules="[v => !!v || '메뉴명을 입력해 주세요.']"
                                    readonly
                                    label="메뉴명"
                                />
                                <v-text-field label="메뉴 경로" readonly v-model="selected.menuPath" />
                            </v-form>
                            <v-divider />
                            <v-card-actions class="justify-end">
                                <v-dialog v-model="dialog" max-width="700px" persistent>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="secondary" outlined class="mb-2" small v-bind="attrs" v-on="on">
                                            신규메뉴 등록
                                        </v-btn>
                                    </template>
                                    <v-card v-if="dialog">
                                        <register-menu-form
                                            :menu="menu"
                                            @close="close"
                                            @success="success"
                                        ></register-menu-form>
                                    </v-card>
                                </v-dialog>
                            </v-card-actions>
                            <table style="width: 100%" class="mt-5 menu-table">
                                <thead class="mb-5">
                                    <tr>
                                        <th>선택</th>
                                        <th>메뉴명</th>
                                        <th>경로</th>
                                        <th>비고</th>
                                    </tr>
                                </thead>
                                <draggable tag="tbody" :list="selected.children">
                                    <tr
                                        class="list-group-item py-3"
                                        v-for="element in selected.children"
                                        :key="element.id"
                                        handle=".handle"
                                    >
                                        <td class="handle">
                                            <v-icon>mdi-menu</v-icon>
                                        </td>
                                        <td>{{ element.menuName }}</td>
                                        <td>{{ element.menuPath }}</td>
                                        <td>
                                            <v-btn icon>
                                                <v-icon small @click="modifyMenu(element)">mdi-pencil</v-icon>
                                            </v-btn>
                                        </td>
                                    </tr>
                                    <tr v-if="selected.children.length == 0">
                                        <td colspan="3" style="text-align: center">조회된 내용이 없습니다.</td>
                                    </tr>
                                </draggable>
                            </table>
                            <confirm-dialog
                                :btnColor="'primary'"
                                :outlined="true"
                                :rounded="true"
                                :btnText="'순서 변경'"
                                :confirmDetailText="'메뉴의 순서를 변경하시겠습니까?'"
                                @success="changeMenuOrder"
                                :depressed="true"
                                :disabled="!valid"
                                v-if="selected.children.length > 0"
                            ></confirm-dialog>
                        </v-container>
                    </v-scroll-y-transition>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import draggable from 'vuedraggable';
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import RegisterMenuForm from '@/components/admin/menu/RegisterMenuForm.vue';
import { getMenuList, saveMenu, modifyMenu, changeOrderNumber } from '@/api/admin/menu';
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
            valid: false,
            dialog: false,
            menu: {},
        };
    },
    computed: {
        filter() {
            return undefined;
        },
    },
    components: {
        draggable,
        RegisterMenuForm,
        ConfirmDialog,
    },
    methods: {
        async getMenuList() {
            let res = await getMenuList();
            console.log(res);
            if (res.success) {
                this.menuList = res.response;
            }
        },
        selectItem(item, e) {
            e.stopPropagation();
            this.selected = item;
            this.menu.orderNumber = this.selected.children.length + 1;
            this.menu.parentId = this.selected.menuId;
        },
        close() {
            this.menu = {};
            this.dialog = false;
        },
        modifyMenu(item) {
            this.menu = this.deepCopy(item);
            this.dialog = true;
        },
        async success(flag, menu) {
            let res;
            if (flag) {
                res = await saveMenu(menu);
            } else {
                res = await modifyMenu(menu);
            }
            if (res.success) {
                this.getMenuList();
                this.close();
            }
            // TODO 재조회 로직 추가
        },
        async changeMenuOrder() {
            for (let i = 0; i < this.selected.children.length; i++) {
                let menu = this.selected.children[i];
                menu.orderNumber = i + 1;
            }
            let res = await changeOrderNumber(this.selected.children);
            if (res.success) {
                this.getMenuList();
            }
        },
    },
};
</script>

<style scoped>
.handle {
    text-align: left;
}
.list-group-item {
    list-style: none;
}
.menu-table {
    border-collapse: separate;
    border-spacing: 0 10px;
}
</style>
