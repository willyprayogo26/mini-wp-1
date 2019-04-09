Vue.component('all-article', {
    data: function() {
        return {
            articles: []
        }
    },
    mounted() {
        if(localStorage.getItem('token')) {
            axios
                .get(`${baseUrl}/articles`, { headers: { "token": localStorage.getItem('token') } })
                .then(({ data }) => {
                    this.articles = data
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
    methods: {

    },
    template: `
    <div class="row mt-4">
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="..." alt="Card image cap">
            <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
        </div>
    </div>
    `
})