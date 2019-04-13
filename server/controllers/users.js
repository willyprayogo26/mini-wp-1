const { User } = require('../models')
const { bcrypt, jwt } = require('../helpers')
const { OAuth2Client } = require('google-auth-library')
// const CLIENT_ID = "280167018459-0ekh5bdr1l75uvr23cbig5un04vq54r1.apps.googleusercontent.com"
const CLIENT_ID = "280167018459-tsknk29al9m355nqa9d0rtno9b4gmjt5.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID)

class userController {
    static registerAdmin (req, res) {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: 'admin'
        })
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            if(err.errors.name) {
                res.status(400).json({
                    message: err.errors.name.message
                })
            } else if(err.errors.email) {
                res.status(400).json({
                    message: err.errors.email.message
                })
            } else if(err.errors.password) {
                res.status(400).json({
                    message: err.errors.password.message
                })
            } else {
                res.status(500).json(err)
            }
        })
    }

    static register (req, res) {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: 'user'
        })
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            if(err.errors.name) {
                res.status(400).json({
                    message: err.errors.name.message
                })
            } else if(err.errors.email) {
                res.status(400).json({
                    message: err.errors.email.message
                })
            } else if(err.errors.password) {
                res.status(400).json({
                    message: err.errors.password.message
                })
            } else {
                res.status(500).json(err)
            }
        })
    }

    static login (req, res) {
        User.findOne({
            email: req.body.email
        })
        .then(user => {
            if(user && bcrypt.comparePassword(req.body.password, user.password)) {
                let token = jwt.jwtSign({
                    id: user.id
                })
                res.status(200).json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: token
                })
            } else {
                res.status(400).json({
                    message: 'Invalid email/password'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static getAllUser (req, res) {
        User.find({})
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static getUserById (req, res) {
        User.findOne({
            _id: req.params.id
        })
        .then(user => {
            if(user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({
                    message: 'User not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static createUser (req, res) {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: 'user'
        })
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            if(err.errors.name) {
                res.status(400).json({
                    message: err.errors.name.message
                })
            } else if(err.errors.email) {
                res.status(400).json({
                    message: err.errors.email.message
                })
            } else if(err.errors.password) {
                res.status(400).json({
                    message: err.errors.password.message
                })
            } else {
                res.status(500).json(err)
            }
        })
    }

    static updateUser (req, res) {
        User.findOneAndUpdate({
            _id: req.params.id
        }, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, {
            new: true
        })
        .then(user => {
            if(user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({
                    message: 'User not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static deleteUser (req, res) {
        User.findOneAndDelete({
            _id: req.params.id
        })
        .then(user => {
            if(user) {
                res.status(200).json({
                    message: 'User successfully deleted'
                })
            } else {
                res.status(404).json({
                    message: 'User not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static googleLogin(req, res) {
        let payload = null
        client
            .verifyIdToken({
                idToken: req.body.token,
                audience: CLIENT_ID
            })
            .then(ticket => {
                payload = ticket.getPayload()

                return User
                    .findOne({
                        email: payload.email
                    })
            })
            .then(user => {
                if (!user) {
                    return User
                        .create({
                            name: payload.name,
                            email: payload.email,
                            password: '1Qazxc',
                            profilePicture: payload.picture,
                            role: 'user'
                        })
                } else {
                    return user
                }
            })
            .then(user => {
                let token = jwt.jwtSign({
                    id: user._id
                })
                res.status(200).json({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: token
                })

            })
            .catch(err => {
                let errors = {}

                if (err.errors.name) {
                    errors.title = err.errors.title.message
                }
                if (err.errors.email) {
                    errors.email = err.errors.email.message
                }
                if (err.errors.password) {
                    errors.password = err.errors.password.message
                }

                let keys = Object.keys(errors)
                if (keys.length !== 0) {
                    res.status(400).json(errors)
                } else {
                    res.status(500).json(err)
                }
            })
    }
}

module.exports = userController