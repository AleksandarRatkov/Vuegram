<template>
<v-container grid-list-xl text-xs-center>
    <v-layout class="settings">
        <v-flex md10 offset-md1>
            <v-alert v-model="showSuccess" transition="scale-transition" dismissible color="green" border="left" elevation="20" colored-border icon="mdi-checkbox-marked-circle-outline">
                {{$t('settings.alert')}} </v-alert>
            <v-card height="fix-content" elevation="18">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline">{{$t('settings.title')}}</v-list-item-title>
                        <v-list-item-subtitle>{{$t('settings.subtitle')}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-card-text>
                    <v-text-field v-model="userProfile.name" :label="$t('settings.form.name')" name="name" prepend-icon="person" type="text" />
                    <v-text-field v-model="userProfile.title" :placeholder="userProfile.title" :label="$t('settings.form.title')" name="title" prepend-icon="domain" type="text" />

                    <v-btn class="white--text" min-width="100px" color="primary" :disabled="userProfile.name ==='' && userProfile.title === ''" @click="updateUserProfile">
                        {{$t('settings.form.updateProfile')}}
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import {
    mapState,
    mapActions
} from "vuex";

export default {
    data() {
        return {
            showSuccess: false
        };
    },
    computed: {
        // ...mapState('user',["userProfile"]),
        ...mapState({
            userProfile: state => state.user.userProfile,
        })
    },
    methods: {
        ...mapActions({updateProfile: 'user/updateProfile'}),
        updateUserProfile() {
            this.updateProfile({
                name: this.userProfile.name,
                title: this.userProfile.title
            });

            this.showSuccess = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.settings {
    padding-top: 5vh;
}
</style>
