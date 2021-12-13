<template>
    <div>
        <v-toolbar color="purple darken-2" dark flat>
            <v-toolbar-title class="pl-5">{{ '사원 등록' }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container fluid class="pa-7">
            <v-card>
                <v-card-title>
                    사원명
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    v-model="selectedItems"
                    :headers="headers"
                    :items="items"
                    item-key="employeeId"
                    :options.sync="options"
                    :server-items-length="totalItems"
                    :loading="loading"
                    show-select
                    class="elevation-1"
                ></v-data-table>
            </v-card>
            <div class="mt-6">
                <v-data-table :headers="headers" :items="selectedItems" class="elevation-1">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>선택한 항목</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                    </template>
                </v-data-table>
                <div class="text-center pt-2 mt-2">
                    <v-btn color="primary" class="mr-2" @click="close">등록</v-btn>
                    <v-btn color="primary" @click="close">취소</v-btn>
                </div>
            </div>
        </v-container>
    </div>
</template>

<script>
import { fakeCallFromApi } from '@/api/account';
export default {
    props: ['selected'],
    mounted() {
        const tables = document.getElementsByTagName('table');
        for (let i = 0; i < tables.length; i++) {
            resizableGrid(tables[i]);
        }

        this.loadSelectedItems();
    },
    data: () => ({
        search: '',
        totalItems: 0,
        items: [],
        loading: true,
        options: {
            sortBy: [],
            sortDesc: [],
            page: 1,
            itemsPerPage: 5,
        },
        selectedItems: [],
        headers: [
            {
                text: '사원번호',
                align: 'center',
                sortable: false,
                value: 'employeeId',
            },
            {
                text: '사원명',
                align: 'center',
                sortable: false,
                value: 'userName',
            },
            {
                text: '이메일',
                align: 'center',
                sortable: false,
                value: 'email',
            },
            {
                text: '삭제',
                align: 'center',
                sortable: false,
                value: 'actions',
            },
        ],
    }),
    watch: {
        options: {
            handler() {
                this.getEmployeeList();
            },
            deep: true,
        },
        search: {
            handler() {
                this.getEmployeeList();
            },
        },
    },
    methods: {
        // 등록된 사원 가져오기
        loadSelectedItems() {
            this.selectedItems = this.selected.employeeDtoList;
        },
        // 미등록된 사원 가져오기
        async getEmployeeList() {
            this.loading = true;
            const param = {};
            param['options'] = this.options;
            param['search'] = this.search;
            let res = await fakeCallFromApi(param);
            if (res.success) {
                this.items = res.response;
                this.totalItems = res.total;
            } else {
                this.successFlag = res.success;
                this.resultMsg = res.message;
            }
            this.loading = false;
        },
        // 선택한 항목 삭제
        deleteItem(item) {
            const employeeId = item['employeeId'];
            this.selectedItems = this.selectedItems.filter(item => item['employeeId'] !== employeeId);
        },
        close() {
            this.$emit('close');
        },
    },
};

function resizableGrid(table) {
    const row = table.getElementsByTagName('tr')[0],
        cols = row ? row.children : undefined;
    if (!cols) return;

    table.style.overflow = 'hidden';

    const tableHeight = table.offsetHeight;

    for (let i = 0; i < cols.length; i++) {
        const div = createDiv(tableHeight);
        cols[i].appendChild(div);
        cols[i].style.position = 'relative';
        setListeners(div);
    }

    function setListeners(div) {
        let pageX, curCol, nxtCol, curColWidth, nxtColWidth;

        div.addEventListener('mousedown', function (e) {
            curCol = e.target.parentElement;
            nxtCol = curCol.nextElementSibling;
            pageX = e.pageX;

            const padding = paddingDiff(curCol);

            curColWidth = curCol.offsetWidth - padding;
            if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
        });

        div.addEventListener('mouseover', function (e) {
            e.target.style.borderRight = '1px solid #1E88E5';
        });

        div.addEventListener('mouseout', function (e) {
            e.target.style.borderRight = '';
        });

        document.addEventListener('mousemove', function (e) {
            if (curCol) {
                const diffX = e.pageX - pageX;

                if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + 'px';

                curCol.style.width = curColWidth + diffX + 'px';
            }
        });

        document.addEventListener('mouseup', function () {
            curCol = undefined;
            nxtCol = undefined;
            pageX = undefined;
            nxtColWidth = undefined;
            curColWidth = undefined;
        });
    }

    function createDiv(height) {
        const div = document.createElement('div');
        div.style.top = 0;
        div.style.right = 0;
        div.style.width = '5px';
        div.style.position = 'absolute';
        div.style.cursor = 'col-resize';
        div.style.userSelect = 'none';
        div.style.height = height + 'px';
        return div;
    }

    function paddingDiff(col) {
        if (getStyleVal(col, 'box-sizing') == 'border-box') {
            return 0;
        }

        const padLeft = getStyleVal(col, 'padding-left');
        const padRight = getStyleVal(col, 'padding-right');
        return parseInt(padLeft) + parseInt(padRight);
    }

    function getStyleVal(elm, css) {
        return window.getComputedStyle(elm, null).getPropertyValue(css);
    }
}
</script>

<style></style>
