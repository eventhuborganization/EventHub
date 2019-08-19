const network = require('./network')
const event = require('../API/EventServiceAPI.js')
const axios = require('axios')

const EventService = new event.EventService(EventServiceHost, EventServicePort)
const UserServiceHostPort = 'http://' + UserServiceHost + ':' + UserServicePort

exports.addUserToEvent = (req, res) => {
    var data = {}
    if(req.body.participant){
        data = {user: {participants: req.session.user}}
    } else if(req.body.follower){
        data = {user: {followers: req.session.user}}
    }
    EventService.addUserToEvent(req.body.event, data,
            response => network.replayResponse(response, res),
            error => network.internalError(res, error))
}

exports.eventInfo = (req, res) => {
    EventService.getEventById(req.params.uuid, response => {
        let event = response.data;
        axios.get(`${UserServiceHostPort}/users/${event.organizator}`)
            .then(organizator => {
                event.organizator = organizator.data;
                network.resultWithJSON(res, event)
            })
            .catch(err => {
                network.internalError(res, err)
            })
    }, err => {
        network.internalError(res, err)
    })
}

exports.searchEventByName = (req, res) => {
    EventService.searchEvent(req.params.data,(response)=>{
        network.resultWithJSON(res,response)
    }, (err) => {
        network.internalError(res, err)
    })
}

exports.getEventsFromIndex = (req, res) => {
    EventService.getEvent(req.query, response => {
        response.data.sort((a, b)=>{
            return a.eventDate - b.eventDate
        })
        // slice(from: escluso, to: incluso)
        var result = response.data.slice(req.params.fromIndex, req.params.fromIndex + 10)
        network.resultWithJSON(res, result);
    })
}

exports.getEventsNear = (req, res) => {
    EventService.getEvent(req.query, response => {
        network.replayResponse(response, res);
    })
}
exports.createEvent = (req, res) => {
    var event = req.body;
    event.thumbnail = "";
    event.organizator = req.session.user;
    EventService.newEvent(event, (response)=>{
        if (event.public) {
            axios.get(`${UserServiceHostPort}/users/${req.session.user}`)
                .then(user => {
                    if (user.data.organization) {
                        axios.get(`${UserServiceHostPort}/users/${req.session.user}/linkedUsers`)
                            .then(resLinkedUsers => {
                                resLinkedUsers.forEach(user => {
                                    axios.post(`${UserServiceHostPort}/users/${user}/notifications`, {typology: 6, sender: req.session.user})
                                })
                            })
                    }
                })
            
        }
        network.resultWithJSON(res,response)
    }, (err) => {
        console.log(err)
        network.internalError(res, err)
    })
}