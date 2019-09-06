const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const passport = require("./src/API/passport");
const task = require("./src/controllers/PeriodicTaskController");
const app = express()

const _cfg = JSON.parse(fs.readFileSync('app.config'))

const _Day = 1000 * 60 * 60 * 24

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
    mongoose.connect("mongodb://" + _cfg.dbpath + "/event-hub-db", { useNewUrlParser: true, useFindAndModify: false })
        .then(
            () => runApp(),
            error => handleMongoConnectionError(error, reconnectTries, reconnectInterval)
        )
        .catch(error => handleMongoConnectionError(error, reconnectTries, reconnectInterval))
}

function handleMongoConnectionError(error, reconnectTries, reconnectInterval) {
    pausecomp(reconnectInterval)
    if (reconnectTries > 0) {
        connect(reconnectTries - 1, reconnectInterval)
    } else {
        console.log("Error: connection to mongodb refused.")
        console.log("Due to: " + error)
    }
}

function runApp() {
    let routes = require('./src/routes/routes')
    //host e port servizio utenti
    global.UserServicePort = 3001
    global.UserServiceHost = "localhost"//'event-hub_user-service'
    global.EventServicePort = 3002
    global.EventServiceHost = "localhost"//'event-hub_event-service'
    global.UserServiceServer = 'http://' + UserServiceHost + ':' + UserServicePort
    global.EventServiceServer = 'http://' + EventServiceHost + ':' + EventServicePort
    //port di questo servizio
    global.port = 3003

    global.appRoot = path.resolve(__dirname)

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    passport.initialize(app)
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
    
    //allow to use the whole content of the folder build
    //app.use(express.static(path.join(__dirname, 'build')))
    routes(app)

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    })

    //eseguito segli eveti svoltisi ieri
    setInterval(task.partecipateActions, _Day)
    
    //eseguito segli eveti svoltisi l'altro ieri
    setInterval(task.reviewActions, _Day)

    app.listen(port, () => console.log(`Web Server now listening on port ${port}!`))
}

connect(reconnectTries, reconnectInterval)
