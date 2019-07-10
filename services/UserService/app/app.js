const express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Event = require('./src/models/model');

const app = express();
const port = 3000;

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
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

    var routes = require('./src/routes/routes')
    routes(app)

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    })

    app.listen(port, () => console.log(`Event service now listening on port ${port}!`))
}

connect(reconnectTries, reconnectInterval)
