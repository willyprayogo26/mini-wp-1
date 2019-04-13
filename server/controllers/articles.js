const { Article } = require('../models')
const { helperTag } = require('../helpers')

class ArticleController {
    static getAllArticle (req, res) {
        Article.find({})
        .populate('author')
        .then(articles => {
            res.status(200).json(articles)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static getArticleByUser (req, res) {
        Article.find({
            author: req.user.id
        })
        .populate('author')
        .then(articles => {
            res.status(200).json(articles)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static getArticleById (req, res) {
        Article.findOne({
            _id: req.params.articleId
        })
        .then(article => {
            res.status(200).json(article)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static getArticleByTag (req, res) {
        Article.find({
            tags: req.params.tagName
        })
        .then(tags => {
            res.status(200).json(tags)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static createArticle (req, res) {
        let temp = helperTag.checkTag(req.body.allTag)
        
        Article.create({
            ...req.body,
            author: req.user.id,
            pictureUrl: req.file ? req.file.cloudStoragePublicUrl : "https://blkbekasi.kemnaker.go.id/subbagiankeuangan/assets-back-end/dist/img/image-not-available.png",
            tags: temp,
            views: 0
        })
        .then(article => {
            res.status(201).json(article)
        })
        .catch(err => {
            if(err.errors.title) {
                res.status(400).json({
                    message: err.errors.title.message
                })
            } else if(err.errors.content) {
                res.status(400).json({
                    message: err.errors.content.message
                })
            } else {
                res.status(500).json(err)
            }
        })
    }

    static updateArticle (req, res) {
        let temp = helperTag.checkTag(req.body.allTag)

        Article.findOne({
            _id: req.params.articleId
        })
        .then(article => {
            return Article.findOneAndUpdate({
                _id: req.params.articleId
            }, {
                ...req.body,
                pictureUrl: req.file ? req.file.cloudStoragePublicUrl : article.pictureUrl,
                tags: temp
            }, {
                new: true
            })
        })
        .then(article => {
            if(article) {
                res.status(200).json(article)
            } else {
                res.status(404).json({
                    message: 'Article not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static deleteArticle (req, res) {
        Article.findOneAndDelete({
            _id: req.params.articleId
        })
        .then(article => {
            if(article) {
                res.status(200).json({
                    message: 'Article successfully deleted'
                })
            } else {
                res.status(404).json({
                    message: 'Article not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static voteArticle (req, res) {
        let status = req.body.status;
        let vote = null;
        status === 'upvote' ? vote = 1 : vote = -1;
        let articleId = req.params.articleId;
        let userId = req.user.id
        Article.findById(articleId)
            .then(article => {
                if (article) {
                    let index = article.votes.findIndex(v => {
                        return v.userId.toString() === userId.toString();
                    })
                    if (index < 0) {
                        article.votes.push({
                            userId: userId,
                            status: vote
                        })
                    } else {
                        if (article.votes[index].status == vote) {
                            article.votes = article.votes.filter(v => {
                                return v.userId.toString() != userId.toString();
                            })
                        } else {
                            article.votes[index].status = vote;
                        }
                    }
                    article.save();
                    res.status(200).json(article)
                } else {
                    res.status(400).json({
                        message: 'Wrong article Id'
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: error.message
                })
            })
    }
}

module.exports = ArticleController