<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="5">
                <v-card class="dashboard--card" elevation="5">
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>출퇴근 등록</v-card-title>
                    <v-row class="d-flex justify-center mt-5 px-3">
                        <v-col cols="12" md="4">
                            <v-card color="grey lighten-3 in-card my-1">
                                <v-row justify="center">
                                    <div class="my-3">
                                        <v-avatar :size="100" v-if="ACCOUNT.profileImage">
                                            <v-img :src="ACCOUNT.profileImage"></v-img>
                                        </v-avatar>
                                        <v-avatar :size="100" v-else>
                                            <v-img v-html="identicon"></v-img>
                                        </v-avatar>
                                    </div>
                                </v-row>
                                <v-row justify="center">
                                    <div class="">
                                        <p class="text-subtitle-2 font-weight-bold">
                                            {{ ACCOUNT.userName }} {{ ACCOUNT.position }}
                                        </p>
                                        <p class="text-subtitle-2">{{ ACCOUNT.departmentName }}</p>
                                    </div>
                                </v-row>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="8">
                            <v-card class="in-card my-1">
                                <v-row>
                                    <v-col cols="4" class="mt-5">
                                        <v-card class="py-3 ml-3 text-center">
                                            {{ today }}
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4" class="mt-5">
                                        <v-card class="py-3 text-center">
                                            {{ time }}
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4" class="mt-5">
                                        <v-btn large @click="doCommute">출근</v-btn>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" md="7">
                <v-card class="dashboard--card" elevation="5">
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>근무현황</v-card-title>
                    <v-row class="d-flex justify-center px-5 mt-2">
                        <v-col cols="6" md="4" lg="3" xl="2">
                            <v-card>
                                <v-toolbar color="purple darken-2" dark dense>
                                    <v-toolbar-title class="text-subtitle-1"> 유연근무제도 </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="text-center">시차출퇴근제</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="6" md="4" lg="3" xl="2">
                            <v-card>
                                <v-toolbar color="purple darken-2" dark dense>
                                    <v-toolbar-title class="text-subtitle-1"> 유연근무명칭 </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="text-center">9시 출근</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="6" md="4" lg="3" xl="2">
                            <v-card>
                                <v-toolbar color="purple darken-2" dark dense>
                                    <v-toolbar-title class="text-subtitle-1"> 계획 근무시간 </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="text-center">184.0</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="6" md="4" lg="3" xl="2">
                            <v-card>
                                <v-toolbar color="purple darken-2" dark dense>
                                    <v-toolbar-title class="text-subtitle-1"> 실 근무시간 </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="text-center">230.3</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="6" md="4" lg="3" xl="2">
                            <v-card>
                                <v-toolbar color="purple darken-2" dark dense>
                                    <v-toolbar-title class="text-subtitle-1"> 평균 근무시간 </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="text-center">46.1</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <v-card class="dashboard--card" elevation="5">
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>바로가기</v-card-title>
                    <div>
                        <v-row class="d-flex justify-space-around px-5 mt-2">
                            <v-card class="mt-5 mb-3">
                                <v-row justify="center" class="pa-10">
                                    <v-btn icon color="light-blue lighten-1" x-large fab>
                                        <v-icon class="text-h1"> mdi-calendar-arrow-right </v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row justify="center" class="mb-3">
                                    <span>근무계획등록</span>
                                </v-row>
                            </v-card>
                            <v-card class="mt-5 mb-3">
                                <v-row justify="center" class="pa-10">
                                    <v-btn icon color="light-blue lighten-1" x-large fab>
                                        <v-icon class="text-h1"> mdi-bus-clock </v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row justify="center" class="mb-3">
                                    <span>출/퇴근등록</span>
                                </v-row>
                            </v-card>
                            <v-card class="mt-5 mb-3">
                                <v-row justify="center" class="pa-10">
                                    <v-btn icon color="light-blue lighten-1" x-large fab>
                                        <v-icon class="text-h1"> mdi-briefcase </v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row justify="center" class="mb-3"> 유연근무유형관리 </v-row>
                            </v-card>
                            <v-card class="mt-5 mb-3">
                                <v-row justify="center" class="pa-10">
                                    <v-btn icon color="light-blue lighten-1" x-large fab>
                                        <v-icon class="text-h1"> mdi-cog </v-icon>
                                    </v-btn>
                                </v-row>
                                <v-row justify="center" class="mb-3">
                                    <span class="mb-2"> 설정 </span>
                                </v-row>
                            </v-card>
                        </v-row>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" md="7" class="mb-10">
                <v-card class="dashboard--card" elevation="5">
                    <v-card-title><v-icon color="orange">mdi-drag-vertical</v-icon>공지사항</v-card-title>
                    <v-data-table
                        dense
                        :headers="headers"
                        :items="boardList"
                        hide-default-footer
                        class="elevation-0 pa-5"
                    ></v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <v-bottom-sheet v-model="sheet" inset>
            <v-sheet class="text-center" height="500px" shaped>
                <v-btn class="mt-6" text color="error" @click="sheet = !sheet"> close </v-btn>
                <v-card style="width: 100%; height: 400px" class="px-3 pb-5" :loading="mapLoading">
                    <div ref="kakaoMap" style="width: 100%; height: 100%"></div>
                </v-card>
            </v-sheet>
        </v-bottom-sheet>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { toSvg } from 'jdenticon';
import dayjs from 'dayjs';
export default {
    mounted() {
        setInterval(() => {
            this.updateNow();
        }, 1000);
    },
    data() {
        return {
            headers: [
                {
                    text: '순번',
                    align: 'center',
                    width: '80',
                    value: 'id',
                },
                {
                    text: '제목',
                    width: '400',
                    value: 'title',
                },
                {
                    text: '등록일자',
                    width: '100',
                    align: 'center',
                    value: 'createdDt',
                },
            ],
            boardList: [
                {
                    id: 1,
                    title: `LGU+, 아이들나라 전용 놀이펜 '유삐펜'체험 서비스`,
                    createdDt: '2021-07-25',
                },
                {
                    id: 2,
                    title: '나노종합기술원, 국내 첫 12인치 반도체 테스트베드 서비스',
                    createdDt: '2021-06-12',
                },
                {
                    id: 3,
                    title: '삼성디스플레이, 게이밍폰 시장 공략...에이수스에 OLED공급',
                    createdDt: '2021-09-10',
                },
                {
                    id: 4,
                    title: '삼성전자,ITU전파통신부문 GC표준화 회의 의장단 진출',
                    createdDt: '2021-10-10',
                },
                {
                    id: 5,
                    title: '카카오 김범수, 재산기부 서약..."죽기 전까지 절반 이상 사회 환원"',
                    createdDt: '2021-11-16',
                },
            ],
            today: dayjs().format('YYYY-MM-DD'),
            time: dayjs().format('HH:mm:ss'),
            sheet: false,
            result: false,
            resultMsg: '',
        };
    },
    computed: {
        ...mapGetters(['ACCOUNT']),
        identicon() {
            return toSvg(this.ACCOUNT.userName, 255);
        },
    },
    methods: {
        updateNow() {
            this.today = dayjs().format('YYYY-MM-DD');
            this.time = dayjs().format('HH:mm:ss');
        },
        doCommute() {
            this.sheet = true;
            this.initialize();
        },
        initialize() {
            if (window.kakao && window.kakao.maps) {
                this.initMap();
            } else {
                const script = document.createElement('script');
                script.onload = () => kakao.maps.load(this.initMap);
                script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAO_API_KEY}&libraries=services`;
                document.head.appendChild(script);
            }
        },
        initMap() {
            if (!('geolocation' in navigator)) {
                this.result = false;
                this.resultMsg = 'Geolocation is not available.';
                return;
            }
            this.geocoder = new kakao.maps.services.Geocoder();
            // get position
            navigator.geolocation.getCurrentPosition(
                pos => {
                    this.latitude = pos.coords.latitude;
                    this.longitude = pos.coords.longitude;
                    this.mapLoading = false;
                    const container = this.$refs.kakaoMap;
                    const options = {
                        center: new kakao.maps.LatLng(this.latitude, this.longitude),
                        level: 3,
                    };
                    this.kakaoMap = new kakao.maps.Map(container, options);
                    this.kakaoMap.setDraggable(false);
                    this.kakaoMap.setZoomable(false);
                    this.coords = new kakao.maps.LatLng(this.latitude, this.longitude);
                    this.setAddress();
                },
                err => {
                    this.result = false;
                    this.resultMsg = err.message;
                },
            );
        },
        setAddress() {
            this.searchAddrFromCoords(this.coords, (result, status) => {
                if (status == kakao.maps.services.Status.OK) {
                    let addr = result[0].road_address
                        ? result[0].road_address.address_name
                        : result[0].address.address_name;
                    this.searchAddress(addr);
                }
            });
        },

        searchAddress(addr) {
            this.result = true;
            this.geocoder.addressSearch(addr, (result, status) => {
                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {
                    this.detailAddr = result[0].road_address
                        ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>'
                        : '';
                    this.detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                    this.setMarker();
                } else {
                    this.result = false;
                    this.resultMsg = '검색 결과가 없습니다. 검색어를 다시 입력해 주세요';
                }
            });
        },
    },
};
</script>

<style scoped>
.dashboard--card {
    min-height: 330px;
}
.col-xl-2 {
    max-width: none !important;
}
.in-card {
    min-height: 200px;
}
</style>
<style>
.wrap {
    position: absolute;
    border: 1px solid gray;
    padding: 10px;
    bottom: 50px;
    left: -125px;
    width: 288px;
    background: burlywood;
    text-align: left;
    overflow: hidden;
    font-size: 12px;
    font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
    line-height: 1.5;
}
.wrap * {
    padding: 0;
    margin: 0;
}
</style>
