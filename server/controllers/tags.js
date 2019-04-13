const { Tag } = require('../models')

class TagController {
    static getAllTag(req, res) {
        Tag.find({})
            .then(tags => {
                if (tags) {
                    res.status(200).json(tags)
                } else {
                    res.status(200).json({
                        message: "Tag Not Found"
                    })
                }
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
}

module.exports = TagController
