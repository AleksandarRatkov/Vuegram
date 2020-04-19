<template>
<v-app id="inspire">
    <side-drawer v-if="!isLoginPage" />
    <navbar v-if="!isLoginPage" />
    <v-content>
        <router-view />
    </v-content>
</v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import SideDrawer from '@/components/SideDrawer.vue';
import {
    mapState
} from 'vuex';

export default {
    name: 'App',

    components: {
        Navbar,
        SideDrawer
    },
    computed: {
        ...mapState(['isLoginPage'])
    },
    data: () => ({
        dialog: false,
    }),
};
</script>
