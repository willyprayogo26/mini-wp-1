Vue.component('my-article', {
    components: {
        wysiwyg: vueWysiwyg.default.component,
        "tags-input": VoerroTagsInput
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
            articleTags: [],
            articleId: '',
            search: '',
            selectedTags: [],
        }
    },
    mounted() {
        if (localStorage.getItem('token')) {
            this.getMyArticle()
        }
    },
    computed: {
        searchArticleByTitle: function() {
          return this.articles.filter(article =>
            article.title.toLowerCase().match(this.search.toLowerCase())
          )
        },
    },
    methods: {
        handleFileUpload() {
            if(this.$refs.fileAdd.files[0]) {
                this.inputImageUrl = this.$refs.fileAdd.files[0]
            } else {
                this.inputImageUrl = this.$refs.file.files[0]
            }
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
        getArticleByTag(name) {
            this.$emit('get-article-by-tag', name)
        },
        addArticle() {
            if(this.selectedTags.length !== 0) {

                this.selectedTags.forEach((e, i) => {
                    this.selectedTags[i] = e.toLowerCase()
                });
                console.log(this.selectedTags)
    
                let data = new FormData()
                data.append('title', this.inputTitle)
                data.append('content', this.inputContent)
                data.append('image', this.inputImageUrl)
                data.append('allTag', this.selectedTags)
    
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
                        console.log(this.articles)
                        this.inputTitle = ''
                        this.inputContent = ''
                        this.inputImageUrl = ''
                        this.selectedTags = []
    
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
            } else {
                Swal.fire({
                    title: 'Tags cannot be empty',
                    animation: false,
                    customClass: {
                        popup: 'animated swing'
                    }
                })
            }
        },
        updateArticle() {
            let data = new FormData()
            data.append('title', this.inputTitle)
            data.append('content', this.inputContent)
            data.append('image', this.inputImageUrl)
            data.append('allTag', this.articleTags)

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
                    this.articleTags = []

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
            this.articleTags = article.tags

            $('#updateArticleModal').modal('toggle')
        },
        votes(state, id) {
            let vote = {
                status: state
            };
            axios
                .put(`${baseUrl}/articles/${localStorage.getItem('id')}/votes/${id}`, vote, {
                    headers: { token: localStorage.getItem("token") }
                })
                .then(({ data }) => {
                    this.getMyArticle()
                })
                .catch(err => {
                    Swal.fire({
                        title: err.response.message,
                        animation: false,
                        customClass: {
                            popup: "animated tada"
                        }
                    });
                });
        },
        showVotes(votes) {
            let status = {
                'upvote': 0,
                'downvote': 0
            }
            votes.forEach(e => {
                if(e.status === 1) {
                    status.upvote += 1
                } else {
                    status.downvote += 1
                }
            });

            return status
        }
    },
    template: `
    <div>
        <div class="row justify-content-between mt-3 align-items-center">
            <h3 style="color: #ffc100;">My Articles</h3>
            <input type="text" v-model="search" placeholder="Search article" class="px-2 text-center" style="border-radius: 20px; height: 30px;">
            <div id="nav-project">
                <button type="button" class="btn text-white" style="background: #ffc100;" @click="showAddArticleForm">Add Article</button>
            </div>
        </div>
        <div class="row justify-content-center">
            <div v-for="(article, index) in searchArticleByTitle" class="card m-4" style="width: 18rem;" data-aos="fade-up" data-aos-duration="3000">
                <div style="height: 350px;">
                    <img class="card-img-top mh-100" :src="article.pictureUrl" alt="Card image cap" @click="showDetails(article)">
                </div>
                <div class="card-body">
                    <blockquote class="blockquote">
                        <p class="card-text">{{ article.title }}</p>
                        <footer class="blockquote-footer">{{ article.views}} views</footer>
                        <footer class="blockquote-footer">Author: {{ article.author.name}} ({{ article.createdAt.slice(0,10) }})</footer>
                    </blockquote>
                    <div class="text-center">
                        <a href="#" @click="showInfoUpdate(article)" class="btn btn-warning">Update</a>
                        <a href="#" @click="deleteArticle(article._id)" class="btn btn-danger">Delete</a>
                    </div>
                    <div>
                        <a v-for="(tag, index) in article.tags" href="#" @click="getArticleByTag(tag)" class="btn badge badge-warning m-1">{{ tag }}</a>
                    </div>
                    <footer class="footer">
                        <a class="btn" @click="votes('upvote', article._id)">
                            <i class="far fa-thumbs-up"></i>
                        </a>
                        {{showVotes(article.votes).upvote}}
                        <a class="btn" @click="votes('downvote', article._id)">
                            <i class="far fa-thumbs-down"></i>
                        </a>
                        {{showVotes(article.votes).downvote}}
                    </footer>
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
                            <label for="recipient-name" class="col-form-label">Title:</label>
                            <input type="text" v-model="inputTitle" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputFile">File:</label>
                            <input type="file" @change="handleFileUpload" class="mt-3" id="fileAdd" ref="fileAdd"></input>
                        </div>
                        <div class="form-group">
                            <label for="recipient-content">Content:</label>
                            <wysiwyg v-model="inputContent"></wysiwyg>
                        </div>
                        <div class="form-group">
                            <label for="recipient-tag">Tags:</label>
                            <tags-input class="px-2" element-id="tags" v-model="selectedTags"></tags-input>
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
                            <label for="recipient-name" class="col-form-label">Title:</label>
                            <input type="text" v-model="inputTitle" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputFile">File:</label>
                            <input type="file" @change="handleFileUpload" class="mt-3" id="file" ref="file"></input>
                        </div>
                        <div class="form-group">
                            <label for="recipient-content">Content:</label>
                            <wysiwyg v-model="inputContent"></wysiwyg>
                        </div>
                        <div class="form-group">
                            <label for="recipient-tag">Tags:</label>
                            <tags-input class="px-2" element-id="tags" v-model="articleTags"></tags-input>
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