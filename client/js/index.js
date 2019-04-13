const baseUrl = 'http://localhost:3000'

var app = new Vue({
    el: '#app',
    data: {
        isLogin: false,
        isGoogle: false,
        position: 'login',
        name: '',
        search: ''
    },
    created() {
        if (localStorage.getItem('token')) {
            this.isLogin = true
            this.getContent()
        } else {
            this.isLogin = false
            this.getLoginForm()
        }
    },
    methods: {
        getRegisForm() {
            this.position = 'register'
        },
        getLoginForm() {
            this.isLogin = false
            this.position = 'login'
            this.name = ''
        },
        getContent() {
            this.isLogin = true
            this.position = 'allArticle'
            this.name = localStorage.getItem('name')
        },
        getAllArticle() {
            this.position = 'allArticle'
        },
        getMyArticle() {
            this.position = 'myArticle'
            this.search = ''
        },
        getAllTag() {
            this.position = 'allTag'
        },
        getArticleByTag(tagName) {
            this.position = 'allTag'
            this.search = tagName
        }
    }
})