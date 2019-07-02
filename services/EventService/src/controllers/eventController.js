var mongoose = require('mongoose');
var Event = mongoose.model('Events');

/**
 * Ottine richede nel database la lista degli eventi.
 * Se li trova manda la risposta al mittente con la lista, altrimenti
 * ritorna una messaggio di errore
 */
exports.getEvent = function(req, res) {
    if(req.params.id){
        Event.findById(req.params.id, (err, movie) => {
            if(err){
                res.send(err)
            }
            res.json(event)
        })
    } else {
        Event.find({}, (err, event) => {
            if(event == null){
                res.status(404).send({
					description: 'Event not found'
				})
            }
            res.json(event)
        })
    }
};


exports.getEventByCreator = function(req, res) {
    if(req.params.creator){
        Event.find().byCreator(req.params.creator).exec((err, event) => {
            res.json(event);
        });
    }
}

exports.getEventByTipology = function(req, res) {
    if(req.params.typology){
        Event.find().byTipology(req.params.typology).exec((err, event) => {
            res.json(event);
        });
    }
}

exports.newEvent = function(eventName, eventDescription = '', eventCreator, visibility = 'Private', typology, subtypology, data, hours, position){
    //Inserire nel database in nuovo evento.
}