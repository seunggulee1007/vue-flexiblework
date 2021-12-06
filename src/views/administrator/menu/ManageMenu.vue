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
                                    <template v-slot:prepend="{ item }" @click="selectDepartment(item)">
                                        <v-icon
                                            v-if="item.children.length > 0"
                                            v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
                                        ></v-icon>
                                    </template>
                                    <template v-slot:append="{ item }">
                                        <v-btn @click="selectItem(item, $event)" small color="warning"> 선택</v-btn>
                                    </template>
                                </v-treeview>
                            </v-card-text>
                        </v-card>
                        <v-divider vertical></v-divider>

            <v-col cols="12" md="5" class="d-flex text-center">

                    <v-scroll-y-transition mode="out-in">
                    </v-scroll-y-transition>
                        </v-col>
                    </v-container>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
export default {
    created() {
        this.initialLize();
    },
    data() {
        return {
            menuList: [],
            search: null,
            open: [],
            seleced: {},
        };
    },
    computed: {
        filter() {
            return undefined;
        },
    },
    methods: {
        initialLize() {
            this.menuList = [
                {
                    menuName: 'Separtners',
                    menuId: 1,
                    children: [
                        {
                            menuName: '유연근무관리',
                            menuId: 2,
                            children: [],
                        },
                    ],
                },
            ];
        },
        selectItem(item, e) {
            e.stopPropagation();
            this.selected = item;
        },
    },
};
</script>

<style></style>
