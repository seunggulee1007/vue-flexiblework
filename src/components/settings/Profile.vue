<template>
    <v-container>
        <v-card>
            <v-alert type="success" v-if="successFlag && resultMsg" dense outlined dismissible>{{ resultMsg }}</v-alert>
            <v-alert type="error" v-else-if="!successFlag && resultMsg" dense outlined dismissible>{{
                resultMsg
            }}</v-alert>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-container>
                            <v-card align="center" :class="cardSize">
                                <v-card v-if="imgSrc != ''">
                                    <vue-cropper
                                        ref="cropper"
                                        :guides="true"
                                        :view-mode="2"
                                        :auto-crop-area="0.5"
                                        :min-container-width="250"
                                        :min-container-height="180"
                                        :background="true"
                                        :src="imgSrc"
                                        :aspectRatio="1 / 1"
                                    ></vue-cropper>
                                </v-card>
                                <!-- 변경된 프로필 사진 -->
                                <v-card v-else-if="changeProfileImage" class="pa-10" alien="center">
                                    <v-avatar :size="imageSize">
                                        <v-img :src="changeProfileImage"></v-img>
                                    </v-avatar>
                                </v-card>
                                <v-card v-else-if="ACCOUNT.profileImage" class="pa-10" alien="center">
                                    <v-avatar :size="imageSize">
                                        <v-img :src="ACCOUNT.profileImage"></v-img>
                                    </v-avatar>
                                </v-card>
                                <!-- 기본 프로필 사진 -->
                                <v-card v-else>
                                    <v-card-text v-html="identicon">
                                        <v-img v-html="identicon"></v-img>
                                    </v-card-text>
                                </v-card>
                                <v-card class="mt-10">
                                    <v-file-input
                                        :rules="rules"
                                        accept="image/png, image/jpeg, image/bmp"
                                        placeholder="프로필 사진을 선택해 주세요."
                                        prepend-icon="mdi-camera"
                                        counter
                                        show-size
                                        @change="setImage"
                                    ></v-file-input>
                                </v-card>
                                <v-card class="mt-5" v-if="imgSrc != ''" width="600">
                                    <v-dialog v-model="dialog" max-width="700px" persistent>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn color="error" v-bind="attrs" block v-on="on" @click="cropImage">
                                                자르기<v-icon right dark> mdi-content-cut </v-icon>
                                            </v-btn>
                                        </template>
                                        <v-card v-if="dialog">
                                            <profile-form
                                                :cropImg="cropImg"
                                                @confirm="confirmImage"
                                                @close="closeModal"
                                            >
                                            </profile-form>
                                        </v-card>
                                    </v-dialog>
                                </v-card>
                                <v-card class="mt-5" v-if="ACCOUNT.profileImage && changeProfileImage != ''">
                                    <v-btn block @click="cropImage" color="error" class="mb-2"> 삭제 </v-btn>
                                </v-card>
                            </v-card>
                        </v-container>
                    </v-col>
                </v-row>
            </v-container>
            <v-card-actions class="justify-center mt-10 px-20">
                <confirm-dialog
                    :btnColor="'primary'"
                    :outlined="true"
                    :rounded="true"
                    :block="true"
                    :btnText="'수정하기'"
                    :confirmDetailText="'프로필을 수정하시겠습니까?'"
                    @success="modifyProfile"
                    :depressed="true"
                ></confirm-dialog>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import ConfirmDialog from '@/components/btns/ConfirmDialog.vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { toSvg } from 'jdenticon';
import ProfileForm from '@/components/settings/ProfileForm.vue';
export default {
    data() {
        return {
            dialog: false,
            successFlag: false,
            resultMsg: '',
            imgSrc: '',
            cropImg: '',
            changeProfileImage: '',
            rules: [value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!'],
        };
    },
    computed: {
        identicon() {
            return toSvg(this.ACCOUNT.userName, 200);
        },
        imageSize() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs':
                    return 170;
                default:
                    return 250;
            }
        },
        cardSize() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs':
                    return '';
                default:
                    return 'mx-15';
            }
        },
    },
    props: ['ACCOUNT'],
    components: { VueCropper, ConfirmDialog, ProfileForm },
    methods: {
        ...mapActions(['CHANGE_PROFILE_IMAGE']),
        setImage(file) {
            if (!file) {
                return;
            }
            if (!file.type.includes('image/')) {
                alert('Please select an image file');
                return;
            }
            if (typeof FileReader === 'function') {
                const reader = new FileReader();
                reader.onload = event => {
                    // rebuild cropperjs with the updated source
                    if (this.imgSrc) {
                        this.$refs.cropper.replace(event.target.result);
                    }
                    this.imgSrc = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                alert('Sorry, FileReader API not supported');
            }
        },
        cropImage() {
            // get image data for post processing, e.g. upload or setting image src
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        confirmImage() {
            this.changeProfileImage = this.cropImg;
            this.imgSrc = '';
            this.closeModal();
        },
        closeModal() {
            this.dialog = false;
        },
        async modifyProfile() {
            this.successFlag = this.changeProfileImage;
            if (!this.changeProfileImage) {
                this.resultMsg = '변경할 이미지를 선택해 주세요.';
                return;
            }
            const param = {
                profileImage: this.changeProfileImage,
            };
            let res = await this.CHANGE_PROFILE_IMAGE(param);
            this.successFlag = res.success;
            this.resultMsg = res.message;
        },
    },
};
</script>

<style scoped>
.cropper-crop-box,
.cropper-view-box {
    border-radius: 50%;
}
</style>
