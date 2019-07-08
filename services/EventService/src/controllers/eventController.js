var mongoose = require('mongoose');
var Event = mongoose.model('Events');

exports.getEvent = (req, res) => {
    if(req.query){
        Event.find(req.query, (err, event) => {
            if(err){
                res.status(404).send(err)
            }
            res.status(event.lengh > 0 ? 201 : 204).json(event)
        })
    }
};

exports.getEventById = (req, res) => {
    if(req.params.uuid){
        Event.findById(req.params.uuid, (err, event) => {
            if(err){
                res.status(404).send(err)
            }
            res.status(event.lengh > 0 ? 201 : 204).json(event)
        })
    }
};

exports.updateEventById = (req, res) => {
    if(req.params.uuid){
        Event.findByIdAndUpdate(req.params.uuid, req.body.event, (err, event) => {
            if(err){
                res.status(404).send(err)
            }
            res.status(200).send(ok)
        })
    }
};

exports.addUserToEvent = (req, res) => {
}

exports.removeUserToEvent = (req, res) => {
}

exports.getEventReviews = (req, res) => {
    Event.findById(req.params.uuid, (err,event) => {
        event.save((err) => {
            if(err) {
                console.log("[ERRORE] - " + err);
                res.status(400).send(err)
            }
        })
        res.status(event.reviews.lengh > 0 ? 201 : 204).json(event.reviews)
    })
}

exports.addEventReviews = (req, res) => {
}

exports.newEvent = (req, res) => {
    var event = new Event(req.body.event)
    event.save((err) => {
        if(err) {
            console.log("[ERRORE] - " + err);
            res.status(400).send(err)
        }
    })
    res.status(201).send("User added")
}