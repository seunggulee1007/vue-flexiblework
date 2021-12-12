<template>
    <main class="modal_container">
        <v-toolbar color="modal" dark flat>
            <v-toolbar-title class="pl-5">부서 검색</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-divider />
        <section class="modal_section">
            <v-container>
                <v-card class="mx-auto mt-5 overflow-auto" max-width="500" min-height="500" max-height="500">
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
                            :items="items"
                            :search="search"
                            :filter="filter"
                            item-text="departmentName"
                            item-key="departmentId"
                            open-on-click
                            transition
                            item-children="children"
                        >
                            <template v-slot:prepend="{ item }">
                                <v-icon
                                    v-if="item.children.length > 0"
                                    v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
                                ></v-icon>
                            </template>
                            <template v-slot:append="{ item }">
                                <v-btn
                                    v-if="item.parentId"
                                    @click="selectItem(item, $event)"
                                    small
                                    color="secondary"
                                    outlined
                                    >선택</v-btn
                                ></template
                            >
                        </v-treeview>
                    </v-card-text>
                </v-card>
            </v-container>
        </section>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="cancel" depressed rounded outlined @click="close"> 닫기 </v-btn>
        </v-card-actions>
    </main>
</template>

<script>
import { getDepartmentList } from '@/api/account';
export default {
    created() {
        this.getDepartmentList();
    },
    data() {
        return {
            items: [],
            search: null,
        };
    },
    computed: {
        filter() {
            return undefined;
        },
    },
    methods: {
        async getDepartmentList() {
            let res = await getDepartmentList();
            if (res.success) {
                this.items = res.response;
            }
        },
        selectItem(item, e) {
            e.stopPropagation();
            this.$emit('select', [item]);
            this.$emit('close');
        },
        close() {
            this.$emit('close');
        },
    },
};
</script>

<style></style>
