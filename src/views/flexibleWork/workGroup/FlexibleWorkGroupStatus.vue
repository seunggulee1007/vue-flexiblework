<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-text-box-check-outline</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="px-5 py-15 container_card">
            <v-row>
                <v-col cols="12" md="2" sm="6">
                    <v-select label="유연근무 유형 선택"></v-select>
                </v-col>
                <v-col cols="12" sm="7">
                    <v-text-field
                        style="width: 60%; display: inline-block"
                        label="유연근무 그룹 명"
                        append-icon="mdi-magnify"
                        placeholder="입력하세요."
                        class="mr-5"
                    ></v-text-field>
                    <v-btn color="primary">조회</v-btn>
                </v-col>
                <v-col cols="12" lg="3" class="text-right">
                    <v-dialog v-model="dialog" max-width="700px" persistent>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="error" class="mt-3" v-bind="attrs" v-on="on">
                                근무 그룹 등록<v-icon right dark> mdi-plus-circle-outline </v-icon>
                            </v-btn>
                        </template>
                        <v-card v-if="dialog">
                            <flexible-work-group-form @close="closeModal"></flexible-work-group-form>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
            <v-divider class="my-10" />
            <v-row>
                <v-col>
                    <v-data-table
                        hide-default-footer
                        :headers="[
                            { text: '순번', value: 'id', align: 'center' },
                            { text: '유연근무 유형', value: 'flexibleWorkType', align: 'center' },
                            { text: '유연근무 그룹 명', value: 'flexibleWorkGroupName', align: 'center' },
                        ]"
                        :items="[
                            { id: 1, flexibleWorkType: '주52시간', flexibleWorkGroupName: '경영지원팀 주 52시간 근무' },
                            { id: 2, flexibleWorkType: '탄력근무', flexibleWorkGroupName: '개발팀 탄력 근무제' },
                            { id: 3, flexibleWorkType: '주52시간', flexibleWorkGroupName: '인사팀 주 52시간 근무' },
                        ]"
                    ></v-data-table>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import FlexibleWorkGroupForm from '@/components/flexibleWork/workGroup/FlexibleWorkGroupForm.vue';
export default {
    components: {
        FlexibleWorkGroupForm,
    },
    data() {
        return {
            dialog: false,
        };
    },
    methods: {
        closeModal() {
            this.dialog = false;
        },
    },
};
</script>

<style></style>
