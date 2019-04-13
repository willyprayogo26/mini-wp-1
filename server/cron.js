const CronJob = require('cron').CronJob
const { nodemailer } = require('./helpers')
const { User } = require('./models')
const { Article } = require('./models')

let MailerJob = new CronJob('0 06 * * 1', function() {
    User.find({})
    .then(users => {
        users.forEach(user => {
            let message = 'Your article with title:\n'
            Article.find({
                author: user._id
            })
            .then(articles => {
                articles.forEach(article => {
                    message += `- ${article.title} has been viewed ${article.views} times \n`
                })
                nodemailer.Mailer(user.email, message)
            })
            .catch(err => {
                console.log(err)
            })
        })
    })
})

module.exports = MailerJob