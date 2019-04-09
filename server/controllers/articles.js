const { Article } = require('../models')

class ArticleController {
    static getAllArticle (req, res) {
        Article.find({})
        .populate('author')
        .populate('tags')
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
        .populate('tags')
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

    static createArticle (req, res) {
        console.log('----cont');
        
        Article.create({
            ...req.body,
            author: req.user.id,
            pictureUrl: req.file.cloudStoragePublicUrl
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
        Article.findOneAndUpdate({
            _id: req.params.articleId
        }, {
            ...req.body,
            pictureUrl: req.file.cloudStoragePublicUrl
        }, {
            new: true
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
}

module.exports = ArticleController