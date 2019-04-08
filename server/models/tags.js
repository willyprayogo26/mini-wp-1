const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema ({
    name: String,
    content: {
        type: String,
        required: [true, 'Please input content']
    },
    articles: [{
        type: Schema.Types.ObjectId,
        ref: 'Article'
      }]
}, {
    timestamps: {}
})

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag