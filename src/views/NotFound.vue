<template>
    <v-app>
        <v-container class="fill-height">
            <v-row justify="center">
                <v-col cols="auto">
                    <v-card>
                        <v-img :src="require('@/assets/notfound.png')" class="ma-3"></v-img>
                        <v-card-text class="text-center">죄송합니다. 해당 페이지를 찾지 못 했습니다.</v-card-text>
                        <div class="text-center pa-5">
                            <router-link to="/" class="home_link">
                                <v-btn tile color="success">
                                    <v-icon left> mdi-home </v-icon>
                                    홈으로 돌아가기
                                </v-btn>
                            </router-link>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
export default {};
</script>

<style scoped>
.home_link {
    text-decoration: none;
    color: black;
}
</style>
