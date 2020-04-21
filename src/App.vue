<template>
<v-app id="app">
    <component :is="layout" />
    <v-content>
        <router-view />
    </v-content>
</v-app>
</template>

<script>
import Default from './layouts/Default'
import {
    mapState
} from 'vuex';

export default {
    name: 'App',
    components: {
        Default
    },
    computed: {
        ...mapState(['isLoginPage']),
        layout() {
            return (this.$route.meta.layout)
        }
    }
};
</script>
