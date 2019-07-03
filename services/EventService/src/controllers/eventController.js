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

exports.getEventByCreator = (req, res) => {
    if(req.params.creator){
        Event.find().byCreator(req.params.creator).exec((err, event) => {
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
    // var event = new Event({name: eventName,
    // description:eventDescription,
    // creator:eventCreator,
    // location: position,
    // visibility: visibility,
    // tipology:typology,
    // subtipology:subtypology,
    // eventData:date})//Inserire nel database in nuovo evento.
    var event = new Event({name: "Eventotest",
        description:"Questa è una descrizione",
        creator:"io",
        location: "da qualche parte",
        visibility: "Private",
        tipology:"a",
        subtipology:"a.1",
        eventData:Date.now})//Inserire nel database in nuovo evento.
    event.save((err) => {if(err) {console.log("[ERRORE] - " + err);}})

    res.status(200).send("Ok boss")
}