const mongoose = require('mongoose')
const fuse = require('fuse.js')
const parser = require('./DataParser')
const network = require('./network')
const Event = mongoose.model('Events')

function queryEvents(req, onSuccess, onError, onNotFound) {
    let query =  Event.find({})
    if(req.query){
        for (const key in req.query) {
            if (req.query.hasOwnProperty(key)) {
                switch (key) {
                    case 'date':
                        console.log('STO FACENDO DATA');
                        query.find({eventDate: parser.parseDateObject(req.query[key])})
                        break;
                    case 'location':
                            let location = JSON.parse(req.query.location)
                            query.find({
                                location:{
                                    geo:{
                                        $geoNear:{
                                            // $maxDistance: location.maxDistance ? location.maxDistance : 100000,
                                            $maxDistance: 1000000,
                                            $geometry: {
                                                type: "Point",
                                                // coordinates: [req.query.location.lng, req.query.location.lat]
                                                coordinates: [12.6137738, 44.0027035]
                                            }
                                        }
                                    }
                                }
                            })
                        break;
                    case 'typology':
                        query.find({typology: req.query[key]})
                        break;
                    default:
                        query.find({key:req.query[key]})
                        break;
                }
            }
        }
    }
    query.exec((err, event) => {
        if(err){
            console.log(`Errore: ${err}`)
            onError(err)
        }
        else if(event && event.length > 0){
            console.log(`Eventi: ${event}`)
            onSuccess(event)
        }
        else{
            console.log('not found')
            onNotFound()    
        }
    })
}

exports.getEvent = (req, res) => {
    queryEvents(
        req, 
        event => network.resultWithJSON(res, event),
        err => network.internalError(res,err),
        () => network.eventNotFound(res)
    )
}

exports.searchEvent = (req, res) => {
    let searchOption = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys:[{
            name: 'name',
            weight: 0.6
        },{
            name: 'description',
            weight: 0.2
        },{
            name: 'typology.name',
            weight: 0.2
        }]
    }
    queryEvents(
        req, 
        event => {
            let fuses = new fuse(event,searchOption)
            let fuseEvent = fuses.search(req.params.data)
            if(fuseEvent)
                network.resultWithJSON(res, fuseEvent)
            else 
                network.eventNotFound(res)
        },
        err => network.internalError(res,err),
        () => network.eventNotFound(res)
    )
}

exports.getEventById = (req, res) => {
    Event.findById(req.params.uuid, (err, event) => {
        if(err)
            network.internalError(res,err)
        else if(event)
            network.resultWithJSON(res, event)
        else
            network.eventNotFound(res)
    })
}

exports.updateEventById = (req, res) => {
    if(req.body.event){
        Event.findByIdAndUpdate(req.params.uuid, req.body.event, (err, event) => {
            if(err)
                network.internalError(res,err)
            else if(event)
                network.resultWithJSON(res, event)
            else 
                network.eventNotFound(res)
        })
    }
}

exports.addUserToEvent = (req, res) => {
    if(req.body.user) {
        let conditions = { _id: req.params.uuid }
        if (req.body.user.participants)
            conditions.$where = 'this.participants.length<this.maximumParticipants'
        let update = { $addToSet: req.body.user }
        let options = { new: true }
        Event.findOneAndUpdate(conditions, update, options, (err, event) => {
            if(err)
                network.internalError(res,err)
            else if(event)
                network.resultWithJSON(res, event)
            else
                network.eventNotFound(res)
        })
    } else {
        network.badRequestJSON(res, {description:'user object is Undefined'})
    }
}

exports.removeUserToEvent = (req, res) => {
    if(req.body.user){
        let update = { $pull: req.body.user }
        let options = { new: true }
        Event.findByIdAndUpdate(req.params.uuid, update, options, (err, event) => {
            if(err)
                network.internalError(res,err)
            else if(event)
                network.resultWithJSON(res, event)
            else 
                network.eventNotFound(res)
        })
    } else {
        network.badRequestJSON(res, {description:'user object is Undefined'})
    }
}

exports.getEventReviews = (req, res) => {
    Event.findById(req.params.uuid, (err, event) => {
        if(err)
            network.internalError(res,err)
        else if(event)
            network.resultWithJSON(res, event.reviews)
        else 
            network.eventNotFound(res)
    })
}

exports.addEventReviews = (req, res) => {
    if(req.params.uuid && req.body.reviews){
        Event.findByIdAndUpdate(req.params.uuid, {$push : req.body.reviews}, (err, event) => {
            if(err)
                network.internalError(res,err)
            else if(event)
                network.result(res)
            else 
                network.eventNotFound(res)
        })
    }
}

exports.newEvent = (req, res) => {
    let eventReceived = req.body.event
    let newLocation = {
        city: eventReceived.locationAddress,
        geo: {
            coordinates: [
                eventReceived.locationLng,
                eventReceived.locationLat
            ]
        }
    }
    console.log("---------------------")
    eventReceived.eventDate = eventReceived.date
    eventReceived.location = newLocation
    eventReceived.maximumParticipants = eventReceived.maxParticipants
    console.log(eventReceived)
    var event = new Event(eventReceived)
    event.save((err, newEvent) => {
        if(err)
            network.internalError(res,err)
        else if(newEvent) {
            newEvent.thumbnail = newEvent._id + Date.now() + newEvent.thumbnail 
            newEvent.save((err, finalEvent) => {
                if (err) {
                    Event.findByIdAndDelete(newEvent._id, () => {
                        network.internalError(res,err)
                    })
                } else if (finalEvent)
                    network.resultWithJSON(res, finalEvent)
            })
        } else
            network.eventNotFound(res)
    })
}

exports.deleteEvent = (req, res) => {
    Event.findByIdAndDelete(req.params.uuid, (err) => {
        if (err)
            network.internalError(res,err)
        else
            network.result(res)
    })
}