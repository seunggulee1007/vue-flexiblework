<template>
    <container class="modal_container">
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
                <v-form ref="workArea" v-model="valid" lazy-validation class="pa-10">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                prepend-icon="mdi-domain"
                                v-model="companyName"
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
                                v-model="searchKeyword"
                            />
                        </v-col>
                        <v-col cols="1">
                            <v-btn color="primary" :disabled="!searchKeyword" @click="searchAddress">검색</v-btn>
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
                </v-form>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"> 취소 </v-btn>
                    <v-btn color="blue darken-1" text :disabled="!valid" @click="saveWorkArea"> 등록 </v-btn>
                </v-card-actions>
            </v-card>
        </section>
    </container>
</template>

<script>
export default {
    data() {
        return {
            textContent: '',
            latitude: 0,
            longitude: 0,
            distance: 100,
            searchKeyword: '',
            kakaoMap: {},
            companyName: '',
            circle: '',
            coords: '',
            marker: '',
            infowindow: '',
            detailAddr: '',
            geocoder: {},
            mapLoading: false,
            result: true,
            resultMsg: '',
            valid: false,
        };
    },
    watch: {
        distance() {
            this.setCircle();
        },
    },
    mounted() {
        if (window.kakao && window.kakao.maps) {
            this.initMap();
        } else {
            const script = document.createElement('script');
            script.onload = () => kakao.maps.load(this.initMap);
            script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAO_API_KEY}&libraries=services`;
            document.head.appendChild(script);
        }
    },
    methods: {
        initMap() {
            if (!('geolocation' in navigator)) {
                this.resultMsg = 'Geolocation is not available.';
                this.result = false;
                this.mapLoading = false;
                return;
            }
            this.geocoder = new kakao.maps.services.Geocoder();
            this.textContent = 'Locating...';
            this.mapLoading = true;
            // get position
            navigator.geolocation.getCurrentPosition(
                pos => {
                    this.latitude = pos.coords.latitude;
                    this.longitude = pos.coords.longitude;
                    const container = this.$refs.kakaoMap;
                    const options = {
                        center: new kakao.maps.LatLng(this.latitude, this.longitude),
                        level: 3,
                    };
                    let map = new kakao.maps.Map(container, options);
                    this.kakaoMap = map;
                    this.coords = new kakao.maps.LatLng(this.latitude, this.longitude);
                    this.setAddress();
                    kakao.maps.event.addListener(map, 'center_changed', () => {
                        // 지도의 중심좌표를 얻어옵니다
                        var latlng = map.getCenter();
                        this.latitude = latlng.getLat();
                        this.longitude = latlng.getLng();
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
        searchAddress() {
            this.result = true;
            let geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(this.searchKeyword, (result, status) => {
                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {
                    this.latitude = result[0].y;
                    this.longitude = result[0].x;
                    this.coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                    this.kakaoMap.setCenter(this.coords);
                    this.setAddress();
                } else {
                    this.result = false;
                    this.resultMsg = '검색 결과가 없습니다. 검색어를 다시 입력해 주세요';
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
            if (this.overlay) {
                this.overlay.setMap(null);
            }
            var content = `
                <div class="wrap">
                    ${this.detailAddr}
                </div>
                `;

            // 마커 위에 커스텀오버레이를 표시합니다
            // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
            this.overlay = new kakao.maps.CustomOverlay({
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
                center: new kakao.maps.LatLng(this.latitude, this.longitude), // 원의 중심좌표 입니다
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
        searchAddrFromCoords(coords, callback) {
            // 좌표로 행정동 주소 정보를 요청합니다
            this.geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        },
        setAddress() {
            this.searchAddrFromCoords(this.coords, (result, status) => {
                if (status == kakao.maps.services.Status.OK) {
                    this.detailAddr = result[0].road_address
                        ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>'
                        : '';
                    this.detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                    this.searchKeyword = result[0].road_address
                        ? result[0].road_address.address_name
                        : result[0].address.address_name;
                    this.setMarker();
                    this.setCircle();
                    this.result = true;
                } else {
                    this.result = false;
                    this.resultMsg = '검색 결과가 없습니다.';
                }
            });
        },
        close() {
            this.$emit('close');
        },
        saveWorkArea() {
            if (this.$refs.workArea.validate()) {
                this.close();
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
</style>
