const mongoose = require('mongoose');
const fuse = require('fuse.js')

const Event = mongoose.model('Events');

exports.getEvent = (req, res) => {
    if(req.query && Object.keys(req.query).length > 0){
        console.log(req.query)
        Event.find(req.query, (err, event) => {
            if(err){
                res.status(500).send(err)
            }
            res.status(event.length > 0 ? 201 : 404).json(event)
        })
    } else {
        res.status(400).send('nope')
    }
};

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
        var fuses = new fuse(event,searchOption)

        console.log(event)
        
        res.status(201).json(fuses.search(req.params.data))
    })
}

exports.getEventById = (req, res) => {
    Event.findById(req.params.uuid, (err, event) => {
        if(err)
            res.status(500).send(err)
        else if(event)
                res.status(201).json(event)
            else
                res.status(404)
        
    })
}

exports.updateEventById = (req, res) => {
    if(req.body.event){
        Event.findByIdAndUpdate(req.params.uuid, req.body.event, (err, event) => {
            if(err)
                res.status(500).send(err)
            else if(event)
                res.status(200).send('ok') 
            else 
                res.status(404)
        })
    }
}

exports.addUserToEvent = (req, res) => {
    if(req.body.user){
        console.log(req.body)
        Event.findByIdAndUpdate(req.params.uuid, {$push : req.body.user}, (err, event) => {
            if(err)
                res.status(500).send(err)
            else if(event)
                res.status(200).send('ok') 
            else 
                res.status(404)
        })
    }
}

exports.removeUserToEvent = (req, res) => {
    if(req.body.user){
        Event.findByIdAndUpdate(req.params.uuid, {$pullAll : req.body.user}, (err, event) => {
            if(err)
                res.status(500).send(err)
            else if(event)
                res.status(200).send('ok') 
            else 
                res.status(404)
        })
    }
}

exports.getEventReviews = (req, res) => {
    Event.findById(req.params.uuid, (err, event) => {
        if(err)
            res.status(500).send(err)
        else if(event)
            res.status(event.reviews.length > 0 ? 201 : 204).json(event.reviews)
        else 
            res.status(404)
    })
}

exports.addEventReviews = (req, res) => {
    if(req.params.uuid && req.body.reviews){
        Event.findByIdAndUpdate(req.params.uuid, {$push : req.body.reviews}, (err, event) => {
            if(err)
                res.status(500).send(err)
            else if(event)
                res.status(200).send('ok') 
            else 
                res.status(404)
        })
    }
}

exports.newEvent = (req, res) => {
    console.log(req.body)
    var event = new Event(req.body.event)
    event.save((err, newEvent) => {
        if(err)
            res.status(500).send(err)
        else if(event)
            res.status(200).send('ok') 
        else 
            res.status(404)
    })
}