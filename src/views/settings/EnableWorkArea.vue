<template>
    <v-container>
        <v-toolbar color="secondary" dark flat>
            <v-icon>mdi-map-legend</v-icon>
            <v-toolbar-title class="pl-5">{{ $route.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card class="pa-5">
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        prepend-icon="mdi-domain"
                        v-model="companyName"
                        placeholder="표시할 지점명을 입력해 주세요."
                        label="지점명"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="11">
                    <v-text-field
                        prepend-icon="mdi-map-marker"
                        placeholder="검색할 주소지를 입력해 주세요."
                        label="근무지 주소"
                        v-model="searchKeyword"
                    />
                </v-col>
                <v-col cols="1">
                    <v-btn color="primary" @click="searchAddress">검색</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        prepend-icon="mdi-social-distance-2-meters"
                        label="허용 범위(미터)"
                        v-model="distance"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card style="width: 100%; height: 300px">
                        <div ref="kakaoMap" style="width: 100%; height: 100%"></div>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
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
                this.textContent = 'Geolocation is not available.';
                return;
            }
            this.geocoder = new kakao.maps.services.Geocoder();
            this.textContent = 'Locating...';
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
                    this.setMarker();

                    this.setCircle(this.latitude, this.longitude);
                    const _vm = this;
                    kakao.maps.event.addListener(map, 'center_changed', function () {
                        // 지도의 중심좌표를 얻어옵니다
                        var latlng = map.getCenter();
                        _vm.latitude = latlng.getLat();
                        _vm.longitude = latlng.getLng();
                        _vm.coords = new kakao.maps.LatLng(latlng.getLat(), latlng.getLng());
                        _vm.searchAddrFromCoords(latlng, function (result, status) {
                            if (status == kakao.maps.services.Status.OK) {
                                _vm.detailAddr = result[0].road_address
                                    ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>'
                                    : '';
                                _vm.detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                            }
                        });
                        _vm.setMarker();
                        _vm.setCircle();
                    });
                },
                err => {
                    console.log(err.message);
                },
            );
        },
        searchAddress() {
            let geocoder = new kakao.maps.services.Geocoder();
            const _vm = this;
            geocoder.addressSearch(this.searchKeyword, function (result, status) {
                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {
                    _vm.latitude = result[0].y;
                    _vm.longitude = result[0].x;
                    _vm.coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                    _vm.setMarker();
                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                    _vm.kakaoMap.setCenter(_vm.coords);
                    _vm.setCircle(result[0].y, result[0].x);
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
            const _vm = this;
            // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
            kakao.maps.event.addListener(this.marker, 'click', function () {
                _vm.overlay.setMap(this.kakao);
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
    },
};
</script>

<style>
.wrap {
    position: absolute;
    left: 0;
    bottom: 40px;
    width: 288px;
    height: 132px;
    margin-left: -144px;
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
