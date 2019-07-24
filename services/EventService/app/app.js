const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

var Event = require('./src/models/eventModel')

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
    mongoose.connect('mongodb://event-hub_mongodb/event-hub-db', { useNewUrlParser: true, useFindAndModify: false })
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

    //app.use(session({secret: '343ji43j4n3jn4jk3n'}))

    var routes = require('./src/routes/eventRoutes')
    routes(app)

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    })

    app.listen(port, () => console.log(`User service now listening on port ${port}!`))
}

connect(reconnectTries, reconnectInterval)