const { Article } = require('../models')

module.exports = {
    isAuthorizedAdmin: (req, res, next) => {
        try {
            if(req.user.role === 'admin') {
                next()
            } else {
                res.status(401).json({
                    message: 'Unauthorized'
                })
            }
        } catch(err) {
            res.status(403).json({
                message: 'Forbidden'
            })
        }
    },

    isAuthorizedUser: (req, res, next) => {
        try {
            if(req.user.id.toString() === req.params.id || req.user.role === 'admin') {
                next()
            } else {
                res.status(401).json({
                    message: 'Unauthorized'
                })
            }
        } catch (err) {
            res.status(403).json({
                message: 'Forbidden'
            })
        }
    },

    isAuthorizedArticle: (req, res, next) => {
        try {
            Article.findOne({
                _id: req.params.id
            })
            .then(article => {
                let isRegistered = article.members.some(function (member) {
                    return member.equals(req.user.id)
                })

                if(isRegistered) {
                    next()
                } else {
                    res.status(401).json({
                        message: 'Unauthorized'
                    }) 
                }
            })
            .catch(err => {
                res.status(403).json({
                    message: err.message
                })
            })
        } catch (err) {
            res.status(403).json({
                message: 'Forbidden'
            })
        }
    }
}