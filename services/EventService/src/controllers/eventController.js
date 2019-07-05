var mongoose = require('mongoose');
var Event = mongoose.model('Events');

/**
 * Ottine richede nel database la lista degli eventi.
 * Se li trova manda la risposta al mittente con la lista, altrimenti
 * ritorna una messaggio di errore
 */
exports.getEvent = (req, res) => {
    Event.find({}, (err, event) => {
        if(event == null){
            res.status(404).send({
                description: 'Event not found'
            })
        }
        res.json(event)
    })
};

exports.getEventById = (req, res) => {
    Event.findById(req.params.id, (err, movie) => {
        if(err){
            res.send(err)
        }
        res.json(event)
    })
}

exports.updateEventById = (req, res) => {
    Event.findById(req.params.id, (err, movie) => {
        if(err){
            res.send(err)
        }
        res.json(event)
    })
}

exports.getEventByOrganizator = (req, res) => {
    if(req.params.creator){
        Event.find().byOrganizator(req.params.creator).exec((err, event) => {
            res.json(event);
        });
    }
}

exports.getEventByTipology = (req, res) => {
    if(req.params.typology){
        Event.find().byTipology(req.params.typology).exec((err, event) => {
            res.json(event);
        });
    }
}

exports.newEvent = (req, res) => {
    if(req.body.event){
        var event = new Event(req.body.event)
    event.save((err) => {if(err) {console.log("[ERRORE] - " + err);}})

    res.status(200).send("Ok boss")
    } else {
        res.status(404).send("Campi errati")
    }
}