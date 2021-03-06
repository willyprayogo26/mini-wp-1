Vue.component('all-article', {
    data: function () {
        return {
            articles: [],
            articleTitle: '',
            articleContent: '',
            articleImageUrl: '',
            articleViews: 0,
            articleId: '',
            search: '',
            sort: '',
        }
    },
    mounted() {
        if (localStorage.getItem('token')) {
            this.getAllArticle()
        }
    },
    computed: {
        searchArticleByTitle: function () {
            return this.articles.filter(article =>
                article.title.toLowerCase().match(this.search.toLowerCase())
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
        getArticleByTag(name) {
            this.$emit('get-article-by-tag', name)
        },
        updateViews() {
            let data = new FormData()
            data.append('title', this.articleTitle)
            data.append('content', this.articleContent)
            data.append('image', this.articleImageUrl)
            data.append('allTag', this.articleTags)
            data.append('views', this.articleViews + 1)

            axios({
                method: 'PUT',
                url: `${baseUrl}/articles/${localStorage.getItem('id')}/${this.articleId}`,
                data,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .then(({ data }) => {
                    this.articleTags = []
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
        showDetails(article) {
            this.articleId = article._id
            this.articleTitle = article.title
            this.articleContent = article.content
            this.articleImageUrl = article.pictureUrl
            this.articleTags = article.tags
            this.articleViews = article.views

            $('#detailsModal').modal('toggle')
            this.updateViews()
        },
        sortByViews() {
            if (this.sort === 'descending') {
                this.articles.sort(this.asc)
                this.sort = 'ascending'
            } else if (this.sort === 'ascending') {
                this.articles.sort(this.desc)
                this.sort = 'descending'
            } else {
                this.articles.sort(this.asc)
                this.sort = 'ascending'
            }
        },
        asc(a, b) {
            if (a.views > b.views)
                return -1;
            if (a.views < b.views)
                return 1;
            return 0;
        },
        desc(a, b) {
            if (a.views > b.views)
                return 1;
            if (a.views < b.views)
                return -1;
            return 0;
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
            <h3 style="color: #ffc100;">All Articles</h3>
            <input type="text" v-model="search" placeholder="Search article" class="px-2 text-center" style="border-radius: 20px; height: 30px;">
            <div id="nav-project">
                <button type="button" class="btn text-white" style="background: #ffc100;" @click="sortByViews">Sort by Views</button>
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
                    <div>
                        <a v-for="(tag, index) in article.tags" @click="getArticleByTag(tag)" class="btn badge badge-warning m-1">{{ tag }}</a>
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