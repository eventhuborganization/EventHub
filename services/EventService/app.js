import EventController from './eventController.js';

const express = require('express')
const session = require('express-session')
var bodyParser = require('body-parser')

const app = express()
const port = 3000
const eventController = new EventController()

app.use(bodyParser.json())
//app.use(session({secret: '343ji43j4n3jn4jk3n'}))

app.get("/event/getById/:id", (req,res) => {
    console.log(`[EVENT] | Try to get event by ID: ${req.params.id}!`)
    res.json(eventController.getEvent(req.params.id))
})

app.get("/event/getByTipology/:tipology", (req,res) => {
    console.log(`[EVENT] | Try to get events by TIPOLOGY: ${req.params.tipology}!`)
    res.json(eventController.getEventByTipology(req.params.tipology))
})

app.get("/event/getByCreator/:creator", (req,res) => {
    console.log(`[EVENT] | Try to get events by CREATOR: ${req.params.creator}!`)
    res.json(eventController.getEventByCreator(req.params.creator))
})

app.post("/event/new", (req,res) => {
    if(req.body.event.name &&
        req.body.even.description &&
        req.body.even.creator &&
        req.body.even.visibility &&
        req.body.event.typology &&
        req.body.even.subtypology &&
        req.body.even.data &&
        req.body.even.hours &&
        req.body.even.position){

    newEvent(req.body.event.name,
        req.body.even.description,
        req.body.even.creator,
        req.body.even.visibility,
        req.body.event.typology,
        req.body.even.subtypology,
        req.body.even.data,
        req.body.even.hours,
        req.body.even.position)

        console.log(`[NEW EVENT] | Name: ${req.body.event.name}!`)
        res.status(200).end();
    }

})

app.listen(port, () => console.log(`Event service now listening on port ${port}!`))