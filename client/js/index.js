const baseUrl = 'http://localhost:3000'

var app = new Vue({
    el: '#app',
    data: {
        isLogin: false,
        isGoogle: false,
        position: 'login',
        name: ''
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
            this.position = 'content'
            this.name = localStorage.getItem('name')
        }
    }
})