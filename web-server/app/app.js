const express = require('express')
const https = require('https')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const passport = require("./src/API/passport")
const app = express()

const _cfg = JSON.parse(fs.readFileSync('app.config'))
const privateKey  = fs.readFileSync('certificate/key.pem', 'utf8')
const certificate = fs.readFileSync('certificate/certificate.pem', 'utf8')

const options = {
    key: privateKey,
    cert: certificate
}

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
    mongoose.connect("mongodb://" + _cfg.dbpath_docker + "/event-hub-db", { useNewUrlParser: true, useFindAndModify: false })
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
    global.UserServiceHost = 'event-hub_user-service'
    global.EventServicePort = 3002
    global.EventServiceHost = 'event-hub_event-service'
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
    
    
    routes(app)
    
    app.use(express.static(path.join(__dirname, 'build')))
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'))
    })

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    })

    const task = require("./src/controllers/PeriodicTaskController")
    
    //eseguito segli eveti svoltisi ieri
    setInterval(task.partecipateActions, _Day)
    
    //eseguito segli eveti svoltisi l'altro ieri
    setInterval(task.reviewActions, _Day)

    const server = https.createServer(options, app)
    server.listen(port,() => console.log(`Web Server now listening on port ${port}!`))
}

connect(reconnectTries, reconnectInterval)
