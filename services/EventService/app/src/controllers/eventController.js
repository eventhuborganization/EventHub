const mongoose = require('mongoose')
const fuse = require('fuse.js')
const parser = require('./DataParser')
const network = require('./network')
const Event = mongoose.model('Events')

exports.getEvent = (req, res) => {
    let query =  Event.find({})
    if(req.query){
        for (const key in req.query) {
            if (Object.hasOwnProperty(key)) {
                switch (key) {
                    case 'date':
                        query.find({key: parser.parseDateObject(req.query[key])})
                        break;
                    case 'location':
                        var options = {
                            near: [req.query.location.lon, req.query.location.lat],
                            maxDistance: req.body.maxDistance ? req.body.maxDistance : 1000,
                            limit: 10000
                        }
                        Event.geoSearch({type: 'Point'}, options)
                        break;
                    default:
                        query.find({key:req.query[key]})
                        break;
                }
            }
        }
    }
    console.log(query.getFilter())
    query.exec((err, event) => {
        if(err){
            network.internalError(res,err)
        } else if(event)
            network.resultWithJSON(res, event)
            else
            network.eventNotFound(res)     
    })
}

exports.searchEvent = (req, res) => {
    let searchOption = {
        shouldSort: true,
        includeScore: true,
        includeMatches: true,
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
    Event.find({}, (err,event) => {
        if(err)
            network.internalError(res,err)
        else{
            let fuses = new fuse(event,searchOption)
            let fuseEvent = fuses.search(req.params.data)
            if(fuseEvent)
                network.resultWithJSON(res, fuseEvent)
            else 
                network.eventNotFound(res)  
        }
    })
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
            conditions.$where = 'this.participants.length<this.maxParticipants'
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
        Event.findByIdAndUpdate(req.params.uuid, {$pullAll : req.body.user}, (err, event) => {
            if(err)
                network.internalError(res,err)
            else if(event)
                network.result(res)
            else 
                network.eventNotFound(res)
        })
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
        city: eventReceived.location.address,
        geo: {
            coordinates: [
                eventReceived.location.lat,
                eventReceived.location.lng
            ]
        }
    }

    eventReceived.eventDate = eventReceived.date
    eventReceived.location = newLocation
    eventReceived.maximumParticipants = eventReceived.maxParticipants
    var event = new Event(eventReceived)
    event.save((err, newEvent) => {
        if(err)
            network.internalError(res,err)
        else if(newEvent)
            network.resultWithJSON(res, newEvent)
        else 
            network.eventNotFound(res)
    })
}