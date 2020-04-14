<template>
<v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
    <v-app-bar-nav-icon @click.native="setDrawer(!drawer)" />
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Welcome to Vuegram</span>
    </v-toolbar-title>
    <v-btn icon>
        <v-icon>mdi-facebook</v-icon>
      </v-btn>
    <v-text-field flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search" class="hidden-sm-and-down" />
    <v-spacer />
    <v-badge
        bordered
        bottom
        color="green accent-4"
        dot
        offset-x="10"
        offset-y="10"
      >
        <v-avatar size="40">
          <v-img :src="require('../assets/aleksa.jpeg')" alt="logoImage"></v-img>
        </v-avatar>
      </v-badge>

    <v-btn icon large>
        <v-avatar size="32px" item>
            <v-img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify" />
        </v-avatar>
    </v-btn>
</v-app-bar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'Navbar',
    computed: {
        ...mapState(['drawer'])
    },
    methods: {
        ...mapMutations(['setDrawer'])
    },
}
</script>

<style lang="scss" scoped>

</style>
