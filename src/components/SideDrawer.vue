<template>
<v-navigation-drawer :value="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
    <v-list dense>
        <template v-for="item in items">
            <v-row v-if="item.heading" :key="item.heading" align="center">
                <v-col cols="6">
                    <v-subheader v-if="item.heading">
                        {{ item.heading }}
                    </v-subheader>
                </v-col>
                <v-col cols="6" class="text-center">
                    <a href="#!" class="body-2 black--text">EDIT</a>
                </v-col>
            </v-row>
    
            <v-list-item :key="item.text" link>
                <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        <router-link tag="div" :to="item.route"> {{ item.text }} </router-link>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </template>
    </v-list>
</v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'SideDrawer',
    data() {
        return {
            items: [{
                    icon: 'mdi-account-cog',
                    text: 'Settings',
                    route: '/settings'
                },
                {
                    icon: 'mdi-view-dashboard',
                    text: 'Dashboard',
                    route: '/dashboard'
                }
            ],
        }
    },
    computed: {
        ...mapState(['drawer'])
    },
}
</script>

<style lang="scss" scoped>
</style>
