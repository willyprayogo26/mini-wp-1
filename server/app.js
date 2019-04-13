require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const port = process.env.PORT || 3000
const routes = require('./routes')
const MailerJob = require('./cron')

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@db-mini-willy-w30vg.gcp.mongodb.net/mini-wp?retryWrites=true`, { useNewUrlParser: true })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)

MailerJob.start()

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})