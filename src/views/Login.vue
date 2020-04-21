<template>
<v-container fluid class="background">
    <v-layout row>
        <v-flex md6 class="full-height">
            <h1>Vuegram</h1>
            <p class="login-text">
                Welcome to the
                <a href="https://savvyapps.com/" target="_blank">Savvy Apps</a> sample
                social media web app powered by Vue.js and Firebase. Build this
                project by checking out The Definitive Guide to Getting Started with
                Vue.js
            </p>
        </v-flex>

        <v-flex md6 class="full-height">
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="8">
                    <v-card class="elevation-12" v-show="showLoginForm">
                        <v-toolbar :src="require('../assets/background.webp')" dark flat>
                            <v-toolbar-title>Login form</v-toolbar-title>
                        </v-toolbar>
                        <v-flex class="position" md4 offset-md4>
                            <v-progress-circular :size="120" color="primary" indeterminate v-if="performingRequest">Loading</v-progress-circular>
                        </v-flex>
                        <v-card-text v-if="!performingRequest">
                            <v-form @submit.prevent>
                                <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                                    <v-text-field v-model="loginForm.email" label="Email" :error-messages="errors" required name="loginEmail" prepend-icon="person" />
                                </ValidationProvider>

                                <ValidationProvider v-slot="{ errors }" name="password" rules="required|min:6">
                                    <v-text-field v-model="loginForm.password" id="loginPassword" :error-messages="errors" label="Password" name="password" prepend-icon="lock" type="password" />
                                </ValidationProvider>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="primary" @click="togglePasswordReset">Forgot Password</v-btn>
                            <v-btn text color="primary" @click="toggleForm">Create an account</v-btn>
                            <v-spacer />
                            <v-btn class="white--text" color="primary" @click="login">Login</v-btn>
                        </v-card-actions>
                    </v-card>

                    <v-card class="elevation-12" v-show="!showLoginForm && !showForgotPassword">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>Signup form</v-toolbar-title>
                        </v-toolbar>
                        <v-flex class="position" md4 offset-md4>
                            <v-progress-circular :size="120" color="primary" indeterminate v-if="performingRequest">Loading</v-progress-circular>
                        </v-flex>
                        <v-card-text v-if="!performingRequest">
                            <v-form @submit.prevent>
                                <v-text-field v-model="signupForm.name" label="Name" name="name" prepend-icon="person" type="text" />
                                <v-text-field v-model="signupForm.title" label="Title" name="title" prepend-icon="domain" type="text" />
                                <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                                    <v-text-field v-model="signupForm.email" :error-messages="errors" required label="Email" name="signupEmail" prepend-icon="email" type="text" />
                                </ValidationProvider>
                                <v-text-field v-model="signupForm.password" id="signUpPassword" label="Password" name="password" prepend-icon="lock" type="password" />
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn text color="primary" @click="togglePasswordReset">Back to login</v-btn>
                            <v-btn class="white--text" color="primary" @click="signup">Sign Up</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-card class="elevation-12" v-show="showForgotPassword">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>Reset a password</v-toolbar-title>
                        </v-toolbar>

                        <v-flex md4 offset-md4>
                            <v-flex class="position" md4 offset-md4>
                                <v-progress-circular :size="120" color="primary" indeterminate v-if="performingRequest">Loading</v-progress-circular>
                            </v-flex>
                        </v-flex>
                        <v-card-text v-if="!performingRequest">
                            <v-card-text>We will send you an email to reset your password</v-card-text>
                            <v-form @submit.prevent>
                                <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                                    <v-text-field v-model="passwordForm.email" :error-messages="errors" required label="Email" name="forgotEmail" prepend-icon="person" type="text" />
                                </ValidationProvider>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn text color="primary" @click="togglePasswordReset">Back to login</v-btn>
                            <v-btn class="white--text" color="primary" @click="resetPassword">Submit</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import {
    mapMutations,
    mapActions
} from 'vuex'
import {
    required,
    email,
    min
} from 'vee-validate/dist/rules'
import {
    extend,
    ValidationProvider
} from 'vee-validate'

const fb = require("../firebaseConfig");

extend('required', {
    ...required,
    message: '{_field_} can not be empty',
})

extend('email', {
    ...email,
    message: 'Email must be valid',
})

extend('min', {
    ...min,
    message: '{_field_} must be greater than {length} characters',
})

export default {
    name: 'Login',
    components: {
        ValidationProvider
    },
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
            errorMsg: "",
        };
    },
    methods: {
        ...mapMutations({setCurrentUser: 'user/setCurrentUser'}),
        ...mapActions({fetchUserProfile: 'user/fetchUserProfile'}),
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
                    this.setCurrentUser(user.user);
                    this.fetchUserProfile();
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
                    this.setCurrentUser(user.user);
                    // create user obj
                    fb.usersCollection
                        .doc(user.user.uid)
                        .set({
                            name: this.signupForm.name,
                            title: this.signupForm.title
                        })
                        .then(() => {
                            this.fetchUserProfile();
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
$primary: #1565C0;
$white: #fff;

.position {
    margin-top: 40px;
    margin-bottom: 40px;
}

.full-height {
    color: white;
    height: 100vh;
    padding-top: 30vh;
}

.background {
    // background: linear-gradient(to right, $primary 0%, $primary 50%, $white 50%, $white 100%);
    background-image: url('../assets/background.webp');
    background-size: 50vw 100vh;
    padding-left: 20vh;
}

.login-text {
    max-width: 490px;
    margin-top: 2rem;
    line-height: 1.8;
    font-family: "Open Sans", sans-serif;
}

h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem;
    font-family: "Open Sans", sans-serif;
}

.full-height a {
    color: #fff;
}
</style>
