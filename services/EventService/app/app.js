const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fs = require('fs')
const Event = require('./src/models/eventModel')

const _cfg = JSON.parse(fs.readFileSync('app.config'))

const app = express()
const port = 3002

function pausecomp(millis)
{
    var date = new Date()
    var curDate = null
    do { curDate = new Date() }
    while(curDate-date < millis)
}

let reconnectTries = 10
let reconnectInterval = 2000

function connect(reconnectTries, reconnectInterval) {
    // ! per lavorare con docker sostituire "_cfg.dbpath" con "_cfg.dbpath_docker"
    mongoose.connect(`mongodb://${_cfg.dbpath_docker}/event-hub-db`, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
        .then(
            () => runApp(),
            error => {
                pausecomp(reconnectInterval)
                if (reconnectTries > 0) {
                    connect(reconnectTries - 1, reconnectInterval)
                } else {
                    console.log("Error: connection to mongodb refused.")
                    console.log("Due to: " + error)
                }
            }
        )
}

function runApp() {
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use((req, res, next) => {
        console.log('')
        console.log('-------REQUEST BODY------')
        console.log(req.body)
        console.log('-------REQUEST QUERY------')
        console.log(req.query)
        console.log('---- CONTROLLER LOG----')
        console.log('')
        next()
    })
    //app.use(session({secret: '343ji43j4n3jn4jk3n'}))

    var routes = require('./src/routes/routes')
    routes(app)

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    })

    app.listen(port, () => console.log(`User service now listening on port ${port}!`))
}

connect(reconnectTries, reconnectInterval)
