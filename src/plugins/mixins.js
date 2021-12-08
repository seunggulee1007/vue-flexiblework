export default {
    computed: {
        AUTH_CD() {
            return this.$store.getters.getAuthCd;
        },
    },
    data() {
        return {
            SERVER_URL: process.env.VUE_APP_API_URL,
            kakaoMap: {},
            circle: '',
            coords: '',
            marker: '',
            detailAddr: '',
            geocoder: {},
            mapLoading: true,
            customOverlay: null,
        };
    },
    methods: {
        searchAddrFromCoords(coords, callback) {
            // 좌표로 행정동 주소 정보를 요청합니다
            this.geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        },
        setMarker() {
            // 결과값으로 받은 위치를 마커로 표시합니다
            this.marker = new kakao.maps.Marker({
                map: this.kakaoMap,
                position: this.coords,
            });
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
        checkBizNo(bizNo) {
            // 사업자 번호 체크

            let checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
            let i,
                chkSum = 0,
                c2,
                remander;
            bizNo = bizNo.replace(/-/gi, '');
            if (bizNo.length != 10) {
                return false;
            }
            for (i = 0; i <= 7; i++) {
                chkSum += checkID[i] * bizNo.charAt(i);
            }
            c2 = '0' + checkID[8] * bizNo.charAt(8);
            c2 = c2.substring(c2.length - 2, c2.length);
            chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
            remander = (10 - (chkSum % 10)) % 10;

            return Math.floor(bizNo.charAt(9)) == remander;
        },
        // 영어랑 한글만 입력 가능
        engOrHangleOnly(e) {
			e.target.value = e.target.value.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi, '').trim();  /* eslint-disable-line */
        },
        // 영어만 입력 가능
        engOnly(e) {
            e.target.value = e.target.value.replace(/[0-9]|[^\\!-z]/gi, '');
        },
        // 영어와 숫자만 입력 가능
        engNumberOnly(e) {
            e.target.value = e.target.value.replace(/[^\\!-z]/gi, '');
        },
        // 숫자만 입력 가능
        numbersOnly(e) {
			if (e.target.value != e.target.value.replace(/[^0-9\.]/g, '')) {  /* eslint-disable-line */
				e.target.value = e.target.value.replace(/[^0-9\.]/g, '');  /* eslint-disable-line */
            }
        },
        // 한글만 입력 가능
        koreanOnly(e) {
            e.target.value = e.target.value.replace(/[^ㄱ-힣a-zA-Z0-9]/gi, '');
        },
        bizFormat(e) {
			e.target.value = e.target.value.replace(/[^0-9\.-]/g, '');  /* eslint-disable-line */
        },
        bizNoFormat(e) {
            e.target.value = e.target.value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
        },
        // 날짜 형식 갖고 오기
        formatDate(date, type = '') {
            let year = date.getFullYear();
            let month = new String(date.getMonth() + 1);
            let day = new String(date.getDate());
            if (month.length == 1) {
                month = '0' + month;
            }
            if (day.length == 1) {
                day = '0' + day;
            }

            return year + type + month + type + day;
        },
        formatDateTime(date, type = '') {
            if (!(date instanceof Date)) {
                return date;
            }
            let year = date.getFullYear();
            let month = new String(date.getMonth() + 1);
            let day = new String(date.getDate());
            if (month.length == 1) {
                month = '0' + month;
            }
            if (day.length == 1) {
                day = '0' + day;
            }
            let hour = date.getHours();
            let min = date.getMinutes();
            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            return `${year}${type}${month}${type}${day} ${hour}:${min}`;
        },
        formatStringMonth(value) {
            if (!value) {
                return '';
            }
            return value.replace(/(\d{4})(\d{2})/, '$1-$2');
        },
        formatStringDate(value) {
            if (!value) {
                return '';
            }
            return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        },
        getTodayFromTo() {
            let arr = new Array();
            arr.push(new Date(`${this.formatDate(new Date(), '-')}:00:00`));
            arr.push(new Date(`${this.formatDate(new Date(), '-')}:23:59`));
            return arr;
        },
        // 시 분을 type에 맞춰서 출력 ex) type = : --> 00:00
        formatTime(date, type = '') {
            let hour = date.getHours();
            let min = date.getMinutes();
            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            return hour + type + min;
        },
        // yyyy-mm형식의 년월 리턴
        getYearMonth() {
            let date = new Date();
            let year = date.getFullYear();
            let month = new String(date.getMonth() + 1);

            if (month.length == 1) {
                month = '0' + month;
            }

            return year + '-' + month;
        },
        // 객체의 깊은 복사
        deepCopy(o) {
            var result = {};
            if (typeof o === 'object' && o !== null) {
                for (let i in o) {
                    result[i] = this.deepCopy(o[i]);
                }
            } else {
                result = o;
            }
            return result;
        },
        getDate(date, type = '', days) {
            if (!(date instanceof Date)) {
                return date;
            }
            if (days) {
                date.setDate(date.getDate() + days);
            }
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            return year + type + month + type + day;
        },
        getMonth(date) {
            if (!(date instanceof Date)) {
                return date;
            }
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            return year + '' + month;
        },
        dateFormat(date) {
            if (!date || date.length < 8) {
                return '-';
            }
            return date.replace(/([0-9]{4})([0-9]*)([0-9]{2})/, '$1-$2-$3');
        },
    },
};
