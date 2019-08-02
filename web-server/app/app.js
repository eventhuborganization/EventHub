const express = require('express')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const app = express()


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

    //host e port servizio utenti
    global.UserServicePort = 3001
    global.UserServiceHost = 'event-hub_user-service'
    global.EventServicePort = 3002
    global.EventServiceHost = 'event-hub_event-service'
    //port di questo servizio
    global.port = 3000

    global.appRoot = path.resolve(__dirname)
    /**
     * Funzione che ci permette di controllare se un utente è loggato o meno.
     * Se non è loggato risponde con un errore
     */
    global.sessionChecker = (req, res, next) => {
        if (req.session.user && req.cookies.user_sid) {
            next()
        } else {
            res.status(400).json({error: 'User not logged'})
        }
    }

    /**
     *  * MIDDLEWARE FLOW
     *  ! non inserire qui sotto quello che non centra con i middleware
     * */
    app.use(cookieParser())

    app.use(session({
        name: 'user_sid',
        resave: false,
        saveUninitialized: false,
        secret: 'EventHubSecret',
        store: new MongoStore({ mongooseConnection:  mongoose.connection }),
        cookie: {
            path: '/', 
            maxAge: 100000000,
            sameSite: true,
            httpOnly: true, 
            secure: false
        }
    }))

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    /**
     * Middleware che controlla se i coockie dell'utente sono ancora salvati nel browser
     * ma l'utente non è impostato, allora effetta un logout automatico.
     *
     * Questo accade quando viene spento il server dopo aver effettuato il login e i
     * coockie rimangono salvati nel browser.
     */

    app.use((req, res, next) => {
        if (req.cookies.user_sid && !req.session.user) {
            res.clearCookie('user_sid')
        }
        next()
    })

    var routes = require('./src/routes/routes')
    routes(app)

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    })

    app.listen(port, () => console.log(`User service now listening on port ${port}!`))
}

connect(reconnectTries, reconnectInterval)