<template>
<div>
    <v-card height="fix-content" class="mx-auto" elevation="18">
        <v-list-item>
            <v-list-item-avatar>
                <v-img :src="require('../assets/aleksa.jpeg')" alt="logoImage"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title class="headline">{{userProfile.name}}</v-list-item-title>
                <v-list-item-subtitle>{{ userProfile.title }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-card-text>
            <v-textarea rows="3" v-model.trim="post.content" outlined :placeholder="$t('dashboard.onYourMind')"></v-textarea>
            <v-btn class="white--text" min-width="100px" color="blue darken-3" :disabled="post.content===''" @click="createPost">
                {{$t('dashboard.post')}}
            </v-btn>
        </v-card-text>
    </v-card>
    <v-divider vertical></v-divider>
    <div v-for="(post,index) in posts" :key="index">
        <v-card height="fix-content" class="mx-auto" elevation="18">
            <v-list-item>
                <v-list-item-avatar>
                    <v-img :src="require('../assets/aleksa.jpeg')" alt="logoImage"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{post.userName}}</v-list-item-title>
                    <v-list-item-subtitle>{{ post.createdOn | formatDate }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-card-text>
                {{post.content}}
            </v-card-text>

            <v-card-actions>
                <v-btn text color="blue darken-3" @click="showCommentForm(post.id)">
                    {{$t('dashboard.comments')}} {{post.comments}}
                </v-btn>
                <v-btn text color="blue darken-3">
                    <v-btn icon color="red darken-1" @click="likePost(post.id, post.likes)">
                        <v-icon>mdi-heart</v-icon>
                    </v-btn> {{post.likes}}
                </v-btn>
                <v-btn text color="blue darken-3" @click="showAllComments(post)">
                    {{ $t(post.id === currentCommentId ? 'dashboard.hideComments' : 'dashboard.showComments')}}
                </v-btn>
            </v-card-actions>

            <template v-if="post.id === currentCommentId">
                <v-card height="fix-content" v-for="(comment,index) in postComments" :key="index">
                    <v-card-title>
                        {{comment.userName}}
                    </v-card-title>

                    <v-card-subtitle>
                        {{ comment.createdOn | formatDate }}
                    </v-card-subtitle>

                    <v-card-actions>
                        {{ comment.content }}
                    </v-card-actions>
                </v-card>
                <v-divider vertical></v-divider>
            </template>

            <v-card-actions v-if="post.id === currentPostId">
                <v-textarea rows="1" v-model.trim="comment.content" outlined :placeholder="$t('dashboard.addComment')"></v-textarea>
                <v-btn @click="addComment(post)" text color="blue darken-3" :disabled="comment.content === ''">
                    {{$t('dashboard.addComment')}}
                </v-btn>
            </v-card-actions>

        </v-card>
        <v-divider vertical></v-divider>
    </div>
</div>
</template>

<script>
import {
    mapState,
    mapMutations
} from "vuex";
import moment from "moment";
const fb = require("../firebaseConfig.js");

export default {
    data() {
        return {
            post: {
                content: ""
            },
            comment: {
                postId: "",
                userId: "",
                content: "",
                postComments: 0
            },
            showPostModal: false,
            fullPost: {},
            postComments: [],
            currentPostId: '',
            currentCommentId: ''
        };
    },
    computed: {
        ...mapState(["userProfile", "currentUser", "posts", "hiddenPosts"]),
    },
    created() {
        this.setIsLoginPage(false)
    },
    methods: {
        ...mapMutations(['setIsLoginPage','setHiddenPosts','setPosts']),
        showAllComments(post) {
            if (this.currentCommentId === post.id) {
                this.currentCommentId = ''
            } else {
                this.currentPostId = ''
                this.currentCommentId = post.id
                this.viewPost(post)
            }

        },
        showCommentForm(postId) {
            this.currentPostId = postId
            this.comment.content = ''
            this.currentCommentId = ''
        },
        createPost() {
            fb.postsCollection
                .add({
                    createdOn: new Date(),
                    content: this.post.content,
                    userId: this.currentUser.uid,
                    userName: this.userProfile.name,
                    comments: 0,
                    likes: 0
                })
                // eslint-disable-next-line no-unused-vars
                .then(ref => {
                    this.post.content = "";
                })
                .catch(err => {
                    console.log(err);
                });
        },
        addComment(post) {
            this.comment.postId = post.id;
            this.comment.userId = post.userId;
            this.comment.postComments = post.comments;

            let postId = this.comment.postId;
            let postComments = this.comment.postComments;

            fb.commentsCollection
                .add({
                    createdOn: new Date(),
                    content: this.comment.content,
                    postId: postId,
                    userId: this.currentUser.uid,
                    userName: this.userProfile.name
                })
                // eslint-disable-next-line no-unused-vars
                .then(doc => {
                    fb.postsCollection
                        .doc(postId)
                        .update({
                            comments: postComments + 1
                        })
                        .then(() => {
                            this.currentPostId = ''
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        likePost(postId, postLikes) {
            let docId = `${this.currentUser.uid}_${postId}`;

            fb.likesCollection
                .doc(docId)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        return;
                    }

                    fb.likesCollection
                        .doc(docId)
                        .set({
                            postId: postId,
                            userId: this.currentUser.uid
                        })
                        .then(() => {
                            // update post likes
                            fb.postsCollection.doc(postId).update({
                                likes: postLikes + 1
                            });
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        viewPost(post) {
            fb.commentsCollection
                .where("postId", "==", post.id)
                .get()
                .then(docs => {
                    let commentsArray = [];

                    docs.forEach(doc => {
                        let comment = doc.data();
                        comment.id = doc.id;
                        commentsArray.push(comment);
                    });

                    this.postComments = commentsArray;
                    this.fullPost = post;
                    this.showPostModal = true;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        closePostModal() {
            this.postComments = [];
            this.showPostModal = false;
        }
    },
    filters: {
        formatDate(val) {
            if (!val) {
                return "-";
            }
            let date = val.toDate();
            return moment(date).fromNow();
        },
        trimLength(val) {
            if (val.length < 200) {
                return val;
            }
            return `${val.substring(0, 200)}...`;
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
