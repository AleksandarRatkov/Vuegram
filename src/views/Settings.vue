<template>
<div>
    
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
