const express = require('express')
var bodyParser = require('body-parser')
const fs = require('fs')
var mongoose = require('mongoose')
var User = require('./src/models/model')
var routes = require('./src/routes/routes')

const app = express()
const port = 3001;

const _cfg = JSON.parse(fs.readFileSync('app.config'))
console.log(_cfg);

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
    mongoose.connect(`mongodb://${_cfg.dbpath_docker}/event-hub-db`, { useNewUrlParser: true, useFindAndModify: false })
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
    routes(app)

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    })

    app.listen(port, () => console.log(`User service now listening on port ${port}!`))
}

connect(reconnectTries, reconnectInterval)
