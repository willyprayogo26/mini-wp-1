Vue.component('all-tag', {
    props: ['search'],
    data: function () {
        return {
            tags: [],
            articles: [],
            articleTitle: '',
            articleContent: '',
            articleImageUrl: '',
        }
    },
    mounted() {
        if (localStorage.getItem('token')) {
            this.getAllTag()
            this.getAllArticle()
        }
    },
    computed: {
        searchArticleByTag: function() {
            return this.articles.filter(article =>
                article.tags.indexOf(this.search) !== -1
            )
        },
    },
    methods: {
        getAllArticle() {
            axios
                .get(`${baseUrl}/articles`, { headers: { "token": localStorage.getItem('token') } })
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
        getAllTag() {
            axios
                .get(`${baseUrl}/tags`, { headers: { "token": localStorage.getItem('token') } })
                .then(({ data }) => {
                    this.tags = data
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
        showDetails(article) {
            this.articleTitle = article.title
            this.articleContent = article.content
            this.articleImageUrl = article.pictureUrl

            $('#detailsModal').modal('toggle')
        },
        showTag() {
            this.search = ''
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
                    this.getAllArticle()
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
            <h3 style="color: #ffc100;">All Tag</h3>
            <input type="text" v-model="search" placeholder="Search article by tag" class="px-2 text-center" style="border-radius: 20px; height: 30px;">
            <div id="nav-project">
                <button type="button" class="btn text-white" style="background: #ffc100;" @click="showTag">Show All Tag</button>
            </div>
        </div>
        <div class="row justify-content-center">
            <div v-for="(article, index) in searchArticleByTag" class="card m-4" style="width: 18rem;" data-aos="fade-up" data-aos-duration="3000">
                <div style="height: 350px;">
                    <img class="card-img-top mh-100" :src="article.pictureUrl" alt="Card image cap" @click="showDetails(article)">
                </div>
                <div class="card-body">
                    <blockquote class="blockquote">
                        <p class="card-text">{{ article.title }}</p>
                        <footer class="blockquote-footer">{{ article.views}} views</footer>
                        <footer class="blockquote-footer">Author: {{ article.author.name}} ({{ article.createdAt.slice(0,10) }})</footer>
                    </blockquote>
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
        <div class="row justify-content-center" v-if="!this.search">
            <div>
                <span v-for="(tag, index) in tags" @click="getArticleByTag(tag.name)" class="btn badge badge-pill badge-warning m-1">{{ tag.name }}</span>
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