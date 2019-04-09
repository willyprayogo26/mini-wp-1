Vue.component('my-article', {
    components: {
        wysiwyg: vueWysiwyg.default.component,
    },
    data: function () {
        return {
            articles: [],
            inputTitle: '',
            inputContent: '',
            inputImageUrl: '',
            articleTitle: '',
            articleContent: '',
            articleImageUrl: '',
            articleId: '',
        }
    },
    mounted() {
        if (localStorage.getItem('token')) {
            this.getMyArticle()
        }
    },
    methods: {
        handleFileUpload() {
            console.log(this.$refs.file.files[0])
            this.inputImageUrl = this.$refs.file.files[0]
            console.log(this.inputImageUrl)
        },
        getMyArticle() {
            axios
                .get(`${baseUrl}/articles/${localStorage.getItem('id')}`, { headers: { "token": localStorage.getItem('token') } })
                .then(({ data }) => {
                    this.articles = data
                    
                    this.inputTitle = ''
                    this.inputContent = ''
                    this.inputImageUrl = ''
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
        addArticle() {
            console.log(this.inputImageUrl)
            let data = new FormData()
            data.append('title', this.inputTitle)
            data.append('content', this.inputContent)
            data.append('image', this.inputImageUrl)

            axios({
                method: 'POST',
                url: `${baseUrl}/articles/${localStorage.getItem('id')}`,
                data,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .then(({ data }) => {
                    this.articles.push(data)
                    this.inputTitle = ''
                    this.inputContent = ''
                    this.inputImageUrl = ''

                    $('#addArticleModal').modal('toggle')
                    Swal.fire({
                        type: 'success',
                        title: 'Successfully add article',
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
        },
        updateArticle() {
            console.log(this.inputImageUrl)
            let data = new FormData()
            data.append('title', this.inputTitle)
            data.append('content', this.inputContent)
            data.append('image', this.inputImageUrl)

            axios({
                method: 'PUT',
                url: `${baseUrl}/articles/${localStorage.getItem('id')}/${this.articleId}`,
                data,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .then(({ data }) => {
                    this.inputTitle = ''
                    this.inputContent = ''
                    this.inputImageUrl = ''

                    $('#updateArticleModal').modal('toggle')
                    Swal.fire({
                        type: 'success',
                        title: 'Successfully update article',
                        showConfirmButton: false,
                        timer: 1500
                    })

                    this.getMyArticle()
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
        deleteArticle(id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    axios({
                        method: 'DELETE',
                        url: `${baseUrl}/articles/${localStorage.getItem('id')}/${id}`,
                        headers: {
                            token: localStorage.getItem('token')
                        }
                    })
                        .then(() => {
                            Swal.fire({
                                type: 'success',
                                title: 'Successfully delete article',
                                showConfirmButton: false,
                                timer: 1500
                            })
        
                            this.getMyArticle()
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
            })
        },
        showAddArticleForm() {
            this.inputTitle = ''
            this.inputContent = ''
            this.inputImageUrl = ''

            $('#addArticleModal').modal('toggle')
        },
        showDetails(article) {
            this.articleTitle = article.title
            this.articleContent = article.content
            this.articleImageUrl = article.pictureUrl

            $('#detailsModal').modal('toggle')
        },
        showInfoUpdate(article) {
            this.articleId = article._id
            this.inputTitle = article.title
            this.inputContent = article.content
            this.inputImageUrl = article.pictureUrl

            $('#updateArticleModal').modal('toggle')
        }
    },
    template: `
    <div>
        <div class="row justify-content-between mt-3">
            <h3 style="color: #ffc100;">My Articles</h3>
            <div id="nav-project">
                <button type="button" class="btn text-white" style="background: #ffc100;" @click="showAddArticleForm">Add Article</button>
            </div>
        </div>
        <div class="row justify-content-center">
            <div v-for="(article, index) in articles" class="card m-4" style="width: 18rem;">
                <div style="height: 350px;">
                    <img class="card-img-top mh-100" :src="article.pictureUrl" alt="Card image cap" @click="showDetails(article)">
                </div>
                <div class="card-body">
                <blockquote class="blockquote">
                    <p class="card-text">{{ article.title }}</p>
                    <footer class="blockquote-footer">Author: {{ article.author.name}} ({{ article.createdAt.slice(0,10) }})</footer>
                </blockquote>
                    <div class="text-center">
                        <a href="#" @click="showInfoUpdate(article)" class="btn btn-warning">Update</a>
                        <a href="#" @click="deleteArticle(article._id)" class="btn btn-danger">Delete</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="addArticleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content" style="width: 110%;">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add Article</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="addArticle">
                        <div class="form-group">
                            <label for="recipient-name" class="col-form-label">Title</label>
                            <input type="text" v-model="inputTitle" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Content</label>
                            <wysiwyg v-model="inputContent"></wysiwyg>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputFile">File</label>
                            <input type="file" @change="handleFileUpload" class="mt-3" id="file" ref="file"></input>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" data-toggle="modal">Add</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="updateArticleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content" style="width: 110%;">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add Article</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="updateArticle">
                        <div class="form-group">
                            <label for="recipient-name" class="col-form-label">Title</label>
                            <input type="text" v-model="inputTitle" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Content</label>
                            <wysiwyg v-model="inputContent"></wysiwyg>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputFile">File</label>
                            <input type="file" @change="handleFileUpload" class="mt-3" id="file" ref="file"></input>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" data-toggle="modal">Update</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="detailsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{ articleTitle }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img class="card-img-top" :src="articleImageUrl" alt="Card image cap">
                        <div v-html="articleContent"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
})