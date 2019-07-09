var mongoose = require('mongoose');
var Event = mongoose.model('Events');

exports.getEvent = (req, res) => {
    if(req.query && Object.keys(req.query).length > 0){
        console.log(req.query)
        Event.find(req.query, (err, event) => {
            if(err){
                res.status(404).send(err)
            }
            res.status(event.length > 0 ? 201 : 204).json(event)
        })
    } else {
        res.status(400).send('nope')
    }
};

exports.getEventById = (req, res) => {
    Event.findById(req.params.uuid, (err, event) => {
        if(err){
            res.status(404).send(err)
        } else {
            res.status(Object.keys(event).length > 0 ? 201 : 204).json(event)
        }
    })
};

exports.updateEventById = (req, res) => {
    if(req.body.event){
        Event.findByIdAndUpdate(req.params.uuid, req.body.event, (err, event) => {
            if(err){
                res.status(400).send(err)
            }
            else {
                res.status(200).send('ok')
            }
        })
    }
};

exports.addUserToEvent = (req, res) => {
    if(req.body.user){
        console.log(req.body)
        Event.findByIdAndUpdate(req.params.uuid, {$push : req.body.user}, (err, event) => {
            console.log(err)
            err ? res.status(400).send(err): res.status(200).send('ok')
        })
    }
}

exports.removeUserToEvent = (req, res) => {
    if(req.body.user){
        Event.findByIdAndUpdate(req.params.uuid, {$pullAll : req.body.user}, (err, event) => {
            err ? res.status(400).send(err): res.status(200).send('ok')
        })
    }
}

exports.getEventReviews = (req, res) => {
    Event.findById(req.params.uuid, (err, event) => {
        if(err){
            res.status(404).send(err)
        } else {
            res.status(event.reviews.length > 0 ? 201 : 204).json(event.reviews)
        }
    })
}

exports.addEventReviews = (req, res) => {
    if(req.params.uuid && req.body.reviews){
        Event.findByIdAndUpdate(req.params.uuid, {$push : req.body.reviews}, (err, event) => {
            err ? res.status(400).send(err): res.status(200).send('ok')
        })
    }
}

exports.newEvent = (req, res) => {
    console.log(req.body)
    var event = new Event(req.body.event)
    event.save((err) => {
        if(err) {
            console.log("[ERRORE] - " + err);
            res.status(400).send(err)
        } else {
            res.status(201).send("User added")
        }
    })
}