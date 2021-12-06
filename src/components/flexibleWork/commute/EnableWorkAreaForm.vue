<template>
    <main class="modal_main">
        <v-toolbar color="purple darken-2" dark flat>
            <v-icon>mdi-map-legend</v-icon>
            <v-toolbar-title class="pl-5">출퇴근 허용지역 등록</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
                <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <section class="modal_section">
            <v-card class="pa-5 container_card">
                <v-form ref="commuteArea" v-model="valid" lazy-validation class="pa-10">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                prepend-icon="mdi-domain"
                                v-model="commuteArea.areaName"
                                placeholder="표시할 지점명을 입력해 주세요."
                                :rules="[v => !!v || '지점명을 입력해 주세요.']"
                                label="지점명"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="11">
                            <v-text-field
                                prepend-icon="mdi-map-marker"
                                placeholder="검색할 주소지를 입력해 주세요."
                                :rules="[v => !!v || '주소지를 입력해 주세요.']"
                                label="근무지 주소"
                                v-model="commuteArea.roadName"
                            />
                        </v-col>
                        <v-col cols="1">
                            <v-btn
                                color="primary"
                                :disabled="!commuteArea.roadName"
                                @click="searchAddress(commuteArea.roadName)"
                                >검색</v-btn
                            >
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                prepend-icon="mdi-more"
                                placeholder="상세주소"
                                :rules="[v => !!v || '상세주소를 입력해 주세요.']"
                                label="상세 주소"
                                v-model="commuteArea.detailAddress"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                prepend-icon="mdi-social-distance-2-meters"
                                label="허용 범위(미터)"
                                :rules="[v => !!v || '허용범위를 입력해 주세요.']"
                                v-model="distance"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-alert type="error" v-if="!result" dense outlined dismissible>{{ resultMsg }}</v-alert>
                        <v-col cols="12">
                            <v-card style="width: 100%; height: 400px" :loading="mapLoading">
                                <div ref="kakaoMap" style="width: 100%; height: 100%"></div>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-if="!mapLoading"
                                class="hide_text_field"
                                v-model="commuteArea.zoneCode"
                                :rules="[v => !!v || '도로명 주소를 기준으로 장소를 선택해 주세요']"
                            />
                        </v-col>
                    </v-row>
                </v-form>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"> 취소 </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        :disabled="!valid"
                        @click="saveCommuteArea"
                        v-if="!this.commuteAreaId"
                    >
                        등록
                    </v-btn>
                    <v-btn color="blue darken-1" text :disabled="!valid" @click="modifyCommuteArea" v-else>
                        수정
                    </v-btn>
                </v-card-actions>
                <v-overlay :value="mapLoading" :absolute="true">
                    <v-card class="text-center pa-5">
                        <v-card-text>지도를 가져오는 중입니다.</v-card-text>
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-card>
                </v-overlay>
            </v-card>
        </section>
    </main>
</template>

<script>
import { saveCommuteArea, modifyCommuteArea, getCommuteArea } from '@/api/commuteArea';
export default {
    async created() {
        if (this.commuteAreaId) {
            await this.getCommuteArea(this.commuteAreaId);
        } else {
            this.initialize();
        }
        this.overlay = true;
    },
    data() {
        return {
            commuteArea: {
                areaName: '', // 지점명
                city: '',
                roadName: '', // 주소
                detailAddress: '', // 상세주소
                distance: 100,
                siGunGu: '',
                dong: '',
                buildingName: '',
                buildingNumber: '',
                zoneCode: '',
                latitude: 0,
                longitude: 0,
            },
            textContent: '',
            distance: 100,
            kakaoMap: {},
            circle: '',
            coords: '',
            marker: '',
            detailAddr: '',
            geocoder: {},
            mapLoading: true,
            result: true,
            resultMsg: '',
            valid: false,
            customOverlay: null,
        };
    },
    watch: {
        distance() {
            this.setCircle();
        },
    },
    props: ['commuteAreaId'],

    methods: {
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
                this.resultMsg = 'Geolocation is not available.';
                this.result = false;
                return;
            }
            this.geocoder = new kakao.maps.services.Geocoder();
            this.textContent = 'Locating...';
            // get position
            navigator.geolocation.getCurrentPosition(
                pos => {
                    if (!this.commuteArea.commuteAreaId) {
                        this.commuteArea.latitude = pos.coords.latitude;
                        this.commuteArea.longitude = pos.coords.longitude;
                    }
                    this.mapLoading = false;
                    const container = this.$refs.kakaoMap;
                    const options = {
                        center: new kakao.maps.LatLng(this.commuteArea.latitude, this.commuteArea.longitude),
                        level: 3,
                    };
                    let map = new kakao.maps.Map(container, options);
                    this.kakaoMap = map;
                    this.coords = new kakao.maps.LatLng(this.commuteArea.latitude, this.commuteArea.longitude);
                    this.setAddress();
                    kakao.maps.event.addListener(map, 'center_changed', () => {
                        // 지도의 중심좌표를 얻어옵니다
                        var latlng = map.getCenter();
                        this.commuteArea.latitude = latlng.getLat();
                        this.commuteArea.longitude = latlng.getLng();
                        this.coords = new kakao.maps.LatLng(latlng.getLat(), latlng.getLng());
                        this.setAddress();
                    });
                },
                err => {
                    this.result = false;
                    this.resultMsg = err.message;
                },
            );
        },
        searchAddress(addr, flag) {
            this.result = true;
            console.log(addr, ' :: ? ');
            if (!addr) {
                addr = this.commuteArea.roadName;
            }
            this.geocoder.addressSearch(addr, (result, status) => {
                console.log(addr, result);
                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {
                    if (!flag) {
                        console.log('여기 아이가 ?');
                        this.commuteArea.latitude = result[0].x;
                        this.commuteArea.longitude = result[0].y;
                        this.coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        this.kakaoMap.setCenter(this.coords);
                    }

                    this.detailAddr = result[0].road_address
                        ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>'
                        : '';
                    this.detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                    const roadName = result[0].road_address
                        ? result[0].road_address.address_name
                        : result[0].address.address_name;
                    this.commuteArea.roadName = roadName;
                    const address = result[0].road_address;
                    if (address) {
                        this.commuteArea.city = address.region_1depth_name;
                        this.commuteArea.roadName = address.address_name;
                        this.commuteArea.siGunGu = address.region_2depth_name;
                        this.commuteArea.dong = address.region_3depth_name;
                        this.commuteArea.buildingName = address.building_name;
                        this.commuteArea.buildingNumber = address.main_building_no;
                        this.commuteArea.zoneCode = address.zone_no;
                    } else {
                        this.commuteArea.zoneCode = '';
                    }
                    this.setMarker();
                    this.setCircle();
                } else {
                    this.result = false;
                    this.resultMsg = '검색 결과가 없습니다. 검색어를 다시 입력해 주세요';
                }
            });
        },
        searchAddrFromCoords(coords, callback) {
            // 좌표로 행정동 주소 정보를 요청합니다
            this.geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        },
        setAddress() {
            this.searchAddrFromCoords(this.coords, (result, status) => {
                if (status == kakao.maps.services.Status.OK) {
                    let addr = result[0].road_address
                        ? result[0].road_address.address_name
                        : result[0].address.address_name;
                    this.result = true;
                    this.searchAddress(addr, true);
                } else {
                    this.result = false;
                    this.resultMsg = '검색 결과가 없습니다.';
                }
            });
        },
        setMarker() {
            if (this.marker) {
                this.marker.setPosition(this.coords);
            } else {
                // 결과값으로 받은 위치를 마커로 표시합니다
                this.marker = new kakao.maps.Marker({
                    map: this.kakaoMap,
                    position: this.coords,
                });
            }
            this.setCustomOverlay();
        },
        setCustomOverlay() {
            if (this.customOverlay) {
                this.customOverlay.setMap(null);
            }
            var content = `
                <div class="wrap">
                    ${this.detailAddr}
                </div>
                `;

            // 마커 위에 커스텀오버레이를 표시합니다
            // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
            this.customOverlay = new kakao.maps.CustomOverlay({
                content: content,
                map: this.kakaoMap,
                position: this.marker.getPosition(),
            });
            // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
            kakao.maps.event.addListener(this.marker, 'click', () => {
                this.setCustomOverlay();
            });
        },
        setCircle() {
            const distance = this.distance / 2;
            if (this.circle) {
                this.circle.setMap(null);
            }

            this.circle = new kakao.maps.Circle({
                center: new kakao.maps.LatLng(this.commuteArea.latitude, this.commuteArea.longitude), // 원의 중심좌표 입니다
                radius: distance, // 미터 단위의 원의 반지름입니다
                strokeWeight: 5, // 선의 두께입니다
                strokeColor: '#75B8FA', // 선의 색깔입니다
                strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                strokeStyle: 'dashed', // 선의 스타일 입니다
                fillColor: '#CFE7FF', // 채우기 색깔입니다
                fillOpacity: 0.7, // 채우기 불투명도 입니다
            });

            // 지도에 원을 표시합니다
            this.circle.setMap(this.kakaoMap);
        },

        close() {
            this.$emit('close');
        },
        async getCommuteArea(commuteAreaId) {
            let res = await getCommuteArea(commuteAreaId);
            if (res.success) {
                this.commuteArea = await res.response;
                this.initialize();
            }
        },
        async saveCommuteArea() {
            if (this.$refs.commuteArea.validate()) {
                let res = await saveCommuteArea(this.commuteArea);
                if (res.success) {
                    this.close();
                }
            }
        },
        async modifyCommuteArea() {
            if (this.$refs.commuteArea.validate()) {
                let res = await modifyCommuteArea(this.commuteArea);
                if (res.success) {
                    this.close();
                }
            }
        },
    },
};
</script>

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
.hide_text_field {
    margin-top: -270px !important;
}
.hide_text_field .v-input__control .v-input__slot .v-text-field__slot > input {
    color: white;
}
.hide_text_field .v-input__control .v-text-field__details .v-messages .v-messages__wrapper .v-messages__message {
    font-size: 14px !important;
    text-align: center !important;
    margin-top: 220px !important;
}
</style>
