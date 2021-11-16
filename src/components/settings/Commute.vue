<template>
    <v-container>
        <v-card>
            <v-row>
                <v-col md="12" cols="12">
                    <v-alert type="success" v-if="successFlag && resultMsg" dense outlined dismissible>{{
                        resultMsg
                    }}</v-alert>
                    <v-alert type="error" v-else-if="!successFlag && resultMsg" dense outlined dismissible>{{
                        resultMsg
                    }}</v-alert>
                </v-col>
            </v-row>
            <v-row>
                <v-col> 근무 일자 : {{ commuteDto.workedDate }} </v-col>
                <v-col>{{ textContent }}</v-col>
            </v-row>
            <v-row>
                <v-col> 출근 시간 : {{ commuteDto.onWorkDate }}</v-col>
                <v-col> 퇴근 시간 : {{ commuteDto.offWorkDate }} </v-col>
            </v-row>
            <v-row>
                <v-card-actions class="justify-center mt-10 px-20">
                    <v-btn @click="initMap">새로고침</v-btn>
                </v-card-actions>
                <v-card width="500" height="300">
                    <div ref="kakaoMap" style="width: 100%; height: 100%"></div>
                </v-card>
            </v-row>
            <v-row>
                <v-card-actions class="justify-center mt-10 px-20">
                    <confirm-dialog
                        :btnColor="'primary'"
                        :rounded="true"
                        :btnText="'출근'"
                        :confirmDetailText="'출근하시겠습니까?'"
                        :depressed="true"
                        @success="doCommute(true)"
                    ></confirm-dialog>
                    <confirm-dialog
                        :btnColor="'warning'"
                        :rounded="true"
                        :btnText="'퇴근'"
                        :confirmDetailText="'퇴근하시겠습니까?'"
                        :depressed="true"
                        @success="doCommute(false)"
                    ></confirm-dialog>
                </v-card-actions>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import { getMyCommute, doCommute } from '@/api/commute';
import { mapGetters } from 'vuex';
export default {
    created() {
        this.getMyCommute();
    },
    components: { ConfirmDialog },
    computed: {
        ...mapGetters(['ACCOUNT']),
    },
    mounted() {
        if (window.kakao && window.kakao.maps) {
            this.initMap();
        } else {
            const script = document.createElement('script');
            script.onload = () => kakao.maps.load(this.initMap);
            script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAO_API_KEY}`;
            document.head.appendChild(script);
        }
    },
    data() {
        return {
            commuteDto: {},
            successFlag: false,
            resultMsg: '',
            latitude: 0,
            longitude: 0,
            textContent: '',
        };
    },
    methods: {
        initMap() {
            if (!('geolocation' in navigator)) {
                this.textContent = 'Geolocation is not available.';
                return;
            }
            this.textContent = 'Locating...';

            // get position
            navigator.geolocation.getCurrentPosition(
                pos => {
                    this.latitude = pos.coords.latitude;
                    this.longitude = pos.coords.longitude;
                    this.textContent = 'Your location data is ' + this.latitude + ', ' + this.longitude;
                    const container = this.$refs.kakaoMap;
                    const options = {
                        center: new kakao.maps.LatLng(this.latitude, this.longitude),
                        level: 3,
                    };
                    const map = new kakao.maps.Map(container, options);
                    const markerPosition = new kakao.maps.LatLng(this.latitude, this.longitude);
                    const marker = new kakao.maps.Marker({
                        position: markerPosition,
                    });
                    marker.setMap(map);
                },
                err => {
                    this.textContent = err.message;
                },
            );
        },
        async getMyCommute() {
            let res = await getMyCommute();
            if (res.success) {
                this.commuteDto = res.response;
            }
        },
        async doCommute(flag) {
            const param = {
                accountId: this.ACCOUNT.accountId,
                onOffFlag: flag,
            };
            let res = await doCommute(param);
            if (res.success) {
                this.commuteDto = res.response;
            }
            this.successFlag = res.success;
            this.resultMsg = res.message;
        },
    },
};
</script>

<style></style>
