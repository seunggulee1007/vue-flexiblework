<template>
    <v-fade-transition mode="out-in">
        <router-view />
    </v-fade-transition>
</template>

<script>
import '@/sass/overrides.sass';
export default {
    name: 'App',
    data: () => ({
        //
    }),
};
</script>
<style scoped>
@import './css/common.css';
</style>
