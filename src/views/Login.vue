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
                <v-col cols="12" sm="10" md="10">
                    <v-card class="elevation-12" v-show="showLoginForm">
                        <v-toolbar src="../assets/background.webp" dark flat>
                            <v-toolbar-title>Login form</v-toolbar-title>
                        </v-toolbar>
                        <v-flex class="position" md4 offset-md4>
                            <v-progress-circular :size="120" color="primary" indeterminate v-if="performingRequest">Loading</v-progress-circular>
                        </v-flex>
                        <ValidationObserver v-slot="{ invalid }">
                            <v-form @submit.prevent>
                                <v-card-text v-if="!performingRequest">
                                    <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                                        <v-text-field v-model="loginForm.email" label="Email" :error-messages="errors" required name="loginEmail" prepend-icon="person" />
                                    </ValidationProvider>

                                    <ValidationProvider v-slot="{ errors }" name="password" rules="required|min:6">
                                        <v-text-field :type="showLoginPassword ? 'text' : 'password'" @click:append="showLoginPassword = !showLoginPassword" :append-icon="showLoginPassword ? 'mdi-eye' : 'mdi-eye-off'" v-model="loginForm.password" id="loginPassword" :error-messages="errors" label="Password" name="password" prepend-icon="lock" />
                                    </ValidationProvider>
                                </v-card-text>
                                <v-flex md4 offset-md4>
                                    <v-card-text @click="loginWithGoogle">
                                        <v-avatar size="40" class="logo">
                                            <v-img src="../assets/google-logo.png" alt="logoImage"></v-img>
                                        </v-avatar>
                                        <h4 class="sign-in">Sign In with Google</h4>
                                    </v-card-text>
                                </v-flex>
                                <v-card-actions>
                                    <v-btn text color="primary" @click="togglePasswordReset">Forgot Password</v-btn>
                                    <v-btn text color="primary" @click="toggleForm">Create an account</v-btn>
                                    <v-spacer />
                                    <v-btn :disabled="invalid" class="white--text" color="primary" @click="login">Login</v-btn>
                                </v-card-actions>
                            </v-form>
                        </ValidationObserver>
                    </v-card>

                    <v-card class="elevation-12" v-show="!showLoginForm && !showForgotPassword">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>Signup form</v-toolbar-title>
                        </v-toolbar>
                        <v-flex class="position" md4 offset-md4>
                            <v-progress-circular :size="120" color="primary" indeterminate v-if="performingRequest">Loading</v-progress-circular>
                        </v-flex>
                        <ValidationObserver v-slot="{ invalid }">
                            <v-form @submit.prevent>
                                <v-card-text v-if="!performingRequest">
                                    <ValidationProvider v-slot="{ errors }" name="name" rules="required">
                                        <v-text-field v-model="signupForm.name" :error-messages="errors" required label="Name" name="name" prepend-icon="person" type="text" />
                                    </ValidationProvider>
                                    <ValidationProvider v-slot="{ errors }" name="title" rules="required">
                                        <v-text-field v-model="signupForm.title" :error-messages="errors" label="Title" name="title" prepend-icon="domain" type="text" />
                                    </ValidationProvider>
                                    <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                                        <v-text-field v-model="signupForm.email" :error-messages="errors" required label="Email" name="signupEmail" prepend-icon="email" type="text" />
                                    </ValidationProvider>
                                    <ValidationProvider v-slot="{ errors }" name="password" rules="required|min:6">
                                        <v-text-field :type="showSignupPassword ? 'text' : 'password'" @click:append="showSignupPassword = !showSignupPassword" :append-icon="showSignupPassword ? 'mdi-eye' : 'mdi-eye-off'" v-model="signupForm.password" :error-messages="errors" id="signUpPassword" label="Password" name="password" prepend-icon="lock" />
                                    </ValidationProvider>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer />
                                    <v-btn text color="primary" @click="toggleForm">Back to login</v-btn>
                                    <v-btn :disabled="invalid" class="white--text" color="primary" @click="signup">Sign Up</v-btn>
                                </v-card-actions>
                            </v-form>
                        </ValidationObserver>
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
    ValidationProvider,
    ValidationObserver
} from 'vee-validate'
import firebase from 'firebase';

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
        ValidationProvider,
        ValidationObserver
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
            showLoginPassword: false,
            showSignupPassword: false,
            userExists: false
        };
    },
    methods: {
        ...mapMutations({
            setCurrentUser: 'user/setCurrentUser'
        }),
        ...mapActions({
            fetchUserProfile: 'user/fetchUserProfile'
        }),
        setPerformingRequest(value) {
            this.performingRequest = value;
        },
        loginWithGoogle() {
            this.setPerformingRequest(true);
            const provider = new firebase.auth.GoogleAuthProvider();
            fb.auth.signInWithPopup(provider).then((user) => {
                this.checkIfUserExist(user.user);
            }).catch((err) => {
                console.log(err);
                this.errorMsg = err.message;
                this.setPerformingRequest(false);
            });
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
                    this.addUserToDb(user.user, this.signupForm.name, this.signupForm.title)
                })
                .catch(err => {
                    console.log(err);
                    this.errorMsg = err.message;
                    this.setPerformingRequest(false);
                });
        },
        addUserToDb(user, name, title) {
            this.setCurrentUser(user);
            fb.usersCollection
                .doc(user.uid)
                .set({
                    name: name,
                    title: title,
                    following: []
                })
                .then(() => {
                    this.afterSuccessfulLogin();
                })
                .catch(err => {
                    console.log(err);
                    this.errorMsg = err.message;
                });
        },
        afterSuccessfulLogin() {
            this.fetchUserProfile();
            this.$router.push("/dashboard");
            this.setPerformingRequest(false);
        },
        checkIfUserExist(user) {
            fb.usersCollection.doc(user.uid).get().then(res => {
                if (!res.exists) {
                    this.addUserToDb(user, user.displayName, '');
                } else {
                    this.afterSuccessfulLogin();
                }
            }).catch(err => {
                console.log(err)
            })
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

.logo {
    margin-left: 40px;
    cursor: pointer;
}

.sign-in {
    color: #0d76eb;
    margin-top: 10px;
    cursor: pointer;
}
</style>
