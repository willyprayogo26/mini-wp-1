Vue.component('navbar', {
    props: ['islogin', 'isgoogle', 'name'],
    data: function() {
        return {
            
        }
    },
    methods: {
        getRegisForm() {
            this.$emit('get-regis-form')
        },
        getLoginForm() {
            this.$emit('get-login-form')
        },
        getAllArticle() {
            this.$emit("get-all-article")
        },
        getMyArticle() {
            this.$emit("get-my-article")
        },
        getAllTag() {
            this.$emit("get-all-tag")
        },
        signOut() {
            if(this.isgoogle === true) {
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                    console.log('User signed out.');
                });
            }
            
            this.getLoginForm()
            localStorage.clear()
        }
    },
    template: `
    <nav class="navbar navbar-expand-sm justify-content-between" style="background: #ffc100;">
        <a class="navbar-brand text-white" href="#">Portfoly</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li v-if="islogin === true" class="nav-item active">
                    <a @click="getAllArticle" class="nav-link text-white" href="#">All Article</a>
                </li>
                <li v-if="islogin === true" class="nav-item active">
                    <a @click="getMyArticle" class="nav-link text-white" href="#">My Article</a>
                </li>
                <li v-if="islogin === true" class="nav-item active">
                    <a @click="getAllTag" class="nav-link text-white" href="#">All Tag</a>
                </li>
            </ul>
            <a v-if="islogin === false" id="btn-regis" href="#" @click="getRegisForm" class="m-2 text-white">Register</a>
            <a v-if="islogin === false" id="btn-login" href="#" @click="getLoginForm" class="m-2 text-white">Login</a>
            <div v-if="islogin === true" class="navbar-brand text-white" style="font-size: 1rem;">{{ name }}</div>
            <div v-if="islogin === true">
                <a href="#" @click="signOut" class="m-2 text-danger"><i class="fas fa-power-off"></i></a>
            </div>
        </div>
    </nav>
    `
})