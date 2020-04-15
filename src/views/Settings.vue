<template>
<div>
    <v-container grid-list-xl text-xs-center>
        <v-layout>
            <v-flex>
                <v-card height="fix-content" elevation="18">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Settings</v-list-item-title>
                            <v-list-item-subtitle>Update your settings</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-text>
                        <v-text-field v-model="name" :placeholder="userProfile.name" label="Name" name="name" prepend-icon="person" type="text" />
                        <v-text-field v-model="title" :placeholder="userProfile.title" label="Title" name="title" prepend-icon="domain" type="text" />

                        <v-btn class="white--text" min-width="100px" color="blue darken-3" :disabled="name ==='' && title === ''" @click="updateProfile">
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
            name: "",
            title: "",
            showSuccess: false
        };
    },
    computed: {
        ...mapState(["userProfile"]),
    },
    created() {
        this.setIsLoginPage(false)
    },
    methods: {
        ...mapMutations(['setIsLoginPage']),
        updateProfile() {
            this.$store.dispatch("updateProfile", {
                name: this.name !== "" ? this.name : this.userProfile.name,
                title: this.title !== "" ? this.title : this.userProfile.title
            });

            this.name = "";
            this.title = "";

            this.showSuccess = true;

            setTimeout(() => {
                this.showSuccess = false;
            }, 2000);
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
