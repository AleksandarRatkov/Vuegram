<template>
<v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
    <v-app-bar-nav-icon @click.native="setDrawer(!drawer)" />
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">{{$t('navbar.welcome')}}</span>
    </v-toolbar-title>
    <v-btn icon>
        <v-icon>mdi-facebook</v-icon>
    </v-btn>
    <v-text-field flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" :label="$t('navbar.search')" class="hidden-sm-and-down" />
    <v-spacer />
    <v-badge bordered bottom color="green accent-4" dot offset-x="10" offset-y="10">
        <v-avatar left size="40">
            <v-img :src="require('../assets/aleksa.jpeg')" alt="logoImage"></v-img>
        </v-avatar>
    </v-badge>

    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn right text v-on="on" @click="logout">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </template>
        <span>Logout</span>
    </v-tooltip>
    <div class="locale">
        <v-select v-model="$i18n.locale" :items="langs" item-value="locale" item-text="lang" outlined></v-select>
    </div>
</v-app-bar>
</template>

<script>
import {
    mapState,
    mapMutations
} from 'vuex'

const fb = require("../firebaseConfig.js");

export default {
    name: 'Navbar',
    data() {
        return {
            langs: [{
                    locale: 'en',
                    lang: 'En'
                },
                {
                    locale: 'sr',
                    lang: 'Sr'
                }
            ]
        }
    },
    computed: {
        ...mapState(['drawer']),
    },
    methods: {
        ...mapMutations(['setDrawer']),
        logout() {
            fb.auth
                .signOut()
                .then(() => {
                    this.$store.dispatch("clearData");
                    this.$router.push("/login");
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
}
</script>

<style lang="scss" scoped>
.locale {
    width: 75px;
    height: 58px;
}
</style>
