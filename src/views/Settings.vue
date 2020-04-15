<template>
<div>
    <v-container grid-list-xl text-xs-center>
        <v-layout>
            <v-flex>
                <v-alert v-model="showSuccess" transition="scale-transition" dismissible color="green" border="left" elevation="20" colored-border icon="mdi-checkbox-marked-circle-outline">
                    You've successfully updated your settings!
                </v-alert>
                <v-card height="fix-content" elevation="18">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Settings</v-list-item-title>
                            <v-list-item-subtitle>Update your settings</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-text>
                        <v-text-field v-model="userProfile.name" label="Name" name="name" prepend-icon="person" type="text" />
                        <v-text-field v-model="userProfile.title" :placeholder="userProfile.title" label="Title" name="title" prepend-icon="domain" type="text" />

                        <v-btn class="white--text" min-width="100px" color="blue darken-3" :disabled="userProfile.name ==='' && userProfile.title === ''" @click="updateProfile">
                            Update Profile
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {
    mapState,
    mapMutations
} from "vuex";

export default {
    data() {
        return {
            showSuccess: false
        };
    },
    created () {
        this.setIsLoginPage(false)
    },
    computed: {
        ...mapState(["userProfile"]),
    },
    methods: {
        ...mapMutations(['setIsLoginPage']),
        updateProfile() {
            this.$store.dispatch("updateProfile", {
                name: this.userProfile.name,
                title: this.userProfile.title
            });

            this.showSuccess = true;
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
