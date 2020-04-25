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

export default {
    name: 'App',
    components: {
        Default
    },
    computed: {
        layout() {
            return (this.$route.meta.layout)
        }
    }
};
</script>
