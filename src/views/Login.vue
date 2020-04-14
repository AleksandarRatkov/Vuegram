<template>
<v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12" v-if="showLoginForm">
            <v-toolbar color="blue darken-3" dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="loginForm.email" label="Email" name="email" prepend-icon="person" type="text" />
                    <v-text-field v-model="loginForm.password" id="password" label="Password" name="password" prepend-icon="lock" type="password" />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn text color="blue darken-3" @click="togglePasswordReset">Forgot Password</v-btn>
                <v-btn text color="blue darken-3" @click="toggleForm">Create an account</v-btn>
                <v-spacer />
                <v-btn class="white--text" color="blue darken-3" @click="login">Login</v-btn>
            </v-card-actions>
        </v-card>

        <v-card class="elevation-12" v-if="!showLoginForm && !showForgotPassword">
            <v-toolbar color="blue darken-3" dark flat>
                <v-toolbar-title>Signup form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="signupForm.name" label="Name" name="name" prepend-icon="person" type="text" />
                    <v-text-field v-model="signupForm.title" label="Title" name="title" prepend-icon="domain" type="text" />
                    <v-text-field v-model="signupForm.email" label="Email" name="email" prepend-icon="email" type="text" />
                    <v-text-field v-model="signupForm.password" id="password" label="Password" name="password" prepend-icon="lock" type="password" />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text color="blue darken-3" @click="togglePasswordReset">Back to login</v-btn>
                <v-btn class="white--text" color="blue darken-3" @click="signup">Sign Up</v-btn>
            </v-card-actions>
        </v-card>
        <v-card class="elevation-12" v-if="showForgotPassword">
            <v-toolbar color="blue darken-3" dark flat>
                <v-toolbar-title>Reset a password</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-card-text>We will send you an email to reset your password</v-card-text>
                <v-form>
                    <v-text-field v-model="loginForm.email" label="Email" name="email" prepend-icon="person" type="text" />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text color="blue darken-3" @click="togglePasswordReset">Back to login</v-btn>
                <v-btn class="white--text" color="blue darken-3" @click="resetPassword">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</v-row>
</template>

<script>
import {
    mapState,
    mapMutations
} from 'vuex'

const fb = require("../firebaseConfig");

export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                email: "",
                password: ""
            },
            signupForm: {
                name: "",
                title: "",
                email: "",
                password: ""
            },
            passwordForm: {
                email: ""
            },
            showLoginForm: true,
            showForgotPassword: false,
            performingRequest: false,
            errorMsg: ""
        };
    },
    computed: {
        ...mapState(['isLoginPage']),
        ...mapMutations(['setIsLoginPage'])
    },
    created() {
        this.setIsLoginPage(false)
    },
    methods: {
        setPerformingRequest(value) {
            this.performingRequest = value;
        },
        login() {
            this.setPerformingRequest(true);
            fb.auth
                .signInWithEmailAndPassword(
                    this.loginForm.email,
                    this.loginForm.password
                )
                .then(user => {
                    // this.$store.commit("setCurrentUser", user);
                    this.$store.commit("setCurrentUser", user.user);
                    this.$store.dispatch("fetchUserProfile");
                    this.$router.push("/dashboard");
                    this.setPerformingRequest(false);
                })
                .catch(err => {
                    console.log(err);
                    this.errorMsg = err.message;
                    this.setPerformingRequest(false);
                });
        },
        signup() {
            this.setPerformingRequest(true);

            fb.auth
                .createUserWithEmailAndPassword(
                    this.signupForm.email,
                    this.signupForm.password
                )
                .then(user => {
                    this.$store.commit("setCurrentUser", user.user);
                    // create user obj
                    fb.usersCollection
                        .doc(user.user.uid)
                        .set({
                            name: this.signupForm.name,
                            title: this.signupForm.title
                        })
                        .then(() => {
                            this.$store.dispatch("fetchUserProfile");
                            this.$router.push("/dashboard");
                        })
                        .catch(err => {
                            console.log(err);
                            this.errorMsg = err.message;
                        });
                    this.setPerformingRequest(false);
                })
                .catch(err => {
                    console.log(err);
                    this.errorMsg = err.message;
                    this.setPerformingRequest(false);
                });
        },
        resetPassword() {
            this.performingRequest = true;

            fb.auth
                .sendPasswordResetEmail(this.passwordForm.email)
                .then(() => {
                    this.performingRequest = false;
                    this.passwordResetSuccess = true;
                    this.passwordForm.email = "";
                })
                .catch(err => {
                    console.log(err);
                    this.performingRequest = false;
                    this.errorMsg = err.message;
                });
        },
        togglePasswordReset() {
            if (this.showForgotPassword) {
                this.showLoginForm = true;
                this.showForgotPassword = false;
                this.passwordResetSuccess = false;
            } else {
                this.showLoginForm = false;
                this.showForgotPassword = true;
            }
        },
        toggleForm() {
            this.showLoginForm = !this.showLoginForm;
            this.errorMsg = "";
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
