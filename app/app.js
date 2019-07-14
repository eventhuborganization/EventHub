const express = require('express')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

//host e port servizio utenti
global.UserServicePort = 3001
global.UserServiceHost = '127.0.0.1'
global.EventServicePort = 3002
global.EventServiceHost = '127.0.0.1'
//port di questo servizio
app.set('port', 3000)

global.appRoot = path.resolve(__dirname)

//mongoose.connect('mongodb://localhost/db', { useNewUrlParser: true, useFindAndModify: false })

/**
 *  * MIDDLEWARE FLOW
 *  ! non inserire qui sotto quello che non centra con i middleware
 * */
app.use(cookieParser())

app.use(session({
    key: 'user_sid',
    secret: 'EventHubSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
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
    console.log('Mid 1')
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid')       
    }
    next()
})

/** 
 * Middleware che permette di continuare il flusso dei middleware 
 * se l'utente è loggato, altrimenti ridireziona alla pagina di login
 */
global.sessionChecker = (req, res, next) => {
    console.log('Mid 2')
    if (req.session.user && req.cookies.user_sid) {
        console.log('Mid 2 next')
        console.log(req.session.user)
        console.log(req.cookies.user_sid)
        next()
    } else {
        res.redirect('/login')
    }      
}

var routes = require('./src/routes/route_a.js')
routes(app)

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});
  
app.listen(app.get('port'), () => console.log(`Event service now listening on port ${app.get('port')}!`))