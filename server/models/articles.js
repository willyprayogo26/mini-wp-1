const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new Schema ({
    title: {
        type: String,
        required: [true, 'Please input your title']
    },
    content: {
        type: String,
        required: [true, 'Please input content']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pictureUrl: String,
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
}, {
    timestamps: {}
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article