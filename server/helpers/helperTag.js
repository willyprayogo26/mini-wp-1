const Tag = require('../models/tags')

module.exports = {
    checkTag(allTag) {
        let tags = allTag.split(',')

        tags.forEach(e => {
            Tag.findOne({
                name: e
            })
            .then(tag => {
                if(!tag) {
                    return Tag.create({
                        name: e
                    })
                }
            })
            .then(tag => {
                console.log(tag)
            })
            .catch(err => {
                console.log(err)
            })
        });
        return tags
    }
}