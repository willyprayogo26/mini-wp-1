Vue.component('login-form', {
    data: function() {
        return {
            loginEmail: '',
            loginPassword: '',
            profileImg: ''
        }
    },
    methods: {
        toLogin() {
            let User = {
                email: this.loginEmail,
                password: this.loginPassword
            }
            
            axios
                .post(`${baseUrl}/login`, User)
                .then(({ data }) => {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('id', data.id)
                    localStorage.setItem('name', data.name)
                    localStorage.setItem('email', data.email)

                    this.loginEmail = ''
                    this.loginPassword = ''

                    this.$emit('get-content')
                })
                .catch(err => {
                    Swal.fire({
                        title: err.response.data.message,
                        animation: false,
                        customClass: {
                            popup: 'animated swing'
                        }
                    })
                })
        },
        toLoginGoogle(googleUser) {
            const token = googleUser.getAuthResponse().id_token
            axios
                .post(`${baseUrl}/google-login`, { token: token })
                .then(({ data }) => {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('id', data.id)
                    localStorage.setItem('name', data.name)
                    localStorage.setItem('email', data.email)
                    
                    this.$emit('get-content')
                })
                .catch(err => {
                    console.log(err)
                })
        },
    },
    template: `
    <div class="col-sm-9 col-md-7 col-lg-5 mx-auto" data-aos="zoom-out-down" data-aos-duration="3000">
        <div class="card card-signin my-5">
            <div class="card-body">
                <h5 class="card-title text-center">Sign In</h5>
                <form class="form-signin" @submit.prevent="toLogin" method="POST">
                    <div class="form-label-group">
                        <input type="email" v-model="loginEmail" id="loginEmail" class="form-control" placeholder="Email address" required autofocus>
                        <label for="loginEmail">Email address</label>
                    </div>
    
                    <div class="form-label-group">
                        <input type="password" v-model="loginPassword" id="loginPassword" class="form-control" placeholder="Password" required>
                        <label for="loginPassword">Password</label>
                    </div>
    
                    <button class="btn btn-lg btn-block text-uppercase text-white" type="submit" style="background: #ffc100;">Sign In</button>
                    <hr class="my-4">
                    <g-signin-button v-on:done="toLoginGoogle"/>
                </form>
            </div>
        </div>
    </div>
    `
})