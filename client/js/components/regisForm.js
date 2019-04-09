Vue.component('regis-form', {
    data: function() {
        return {
            regisFullname: '',
            regisEmail: '',
            regisPassword: ''
        }
    },
    methods: {
        toRegis() {
            let newUser = {
                name: this.regisFullname,
                email: this.regisEmail,
                password: this.regisPassword
            }
            axios
                .post(`${baseUrl}/register`, newUser)
                .then(() => {
                    this.regisFullname = ''
                    this.regisEmail = ''
                    this.regisPassword = ''

                    Swal.fire({
                        type: 'success',
                        title: 'Successfully registered',
                        showConfirmButton: false,
                        timer: 1500
                    })
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
        }
    },
    template: `
    <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
            <div class="card-body">
            <h5 class="card-title text-center">Registration</h5>
            <form class="form-signin" @submit.prevent="toRegis">
                <div class="form-label-group">
                    <input type="text" v-model="regisFullname" id="regisFullname" class="form-control" placeholder="Fullname" required autofocus>
                    <label for="regisFullname">Fullname</label>
                </div>

                <div class="form-label-group">
                    <input type="email" v-model="regisEmail" id="regisEmail" class="form-control" placeholder="Email address" required>
                    <label for="regisEmail">Email address</label>
                </div>

                <div class="form-label-group">
                    <input type="password" v-model="regisPassword" id="regisPassword" class="form-control" placeholder="Password" required>
                    <label for="regisPassword">Password</label>
                </div>

                <button class="btn btn-lg btn-block text-uppercase text-white" type="submit" style="background: #ffc100;">Register</button>
            </form>
            </div>
        </div>
    </div>
    `
})