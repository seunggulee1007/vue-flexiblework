<template>
    <div></div>
</template>

<script>
import { checkEmailToken } from '@/api/auth';
export default {
    created() {
        const token = this.$route.query.token;
        const email = this.$route.query.email;
        this.checkEmailToken(token, email);
    },
    methods: {
        async checkEmailToken(token, email) {
            if (!token || !email) {
                alert('유효하지 않은 메일입니다.');
                this.$router.go(-1);
                return;
            }
            let res = await checkEmailToken(token, email);
            alert(res.message);
            if (res.success) {
                this.$router.push('/authentication/sign-in');
            } else {
                this.$router.go(-1);
            }
        },
    },
};
</script>

<style></style>
