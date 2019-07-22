const network = require('./network');
const event = require('../API/EventServiceAPI.js')

const EventService = new event.EventService(EventServiceHost, EventServicePort)
const UserServiceHostPort = 'http://' + UserServiceHost + ':' + UserServicePort

exports.addUserToEvent = (req, res) => {
    var data = {}
    if(req.body.participant){
        data = {user: {participants: req.session.user}}
    } else if(req.body.follower){
        data = {user: {followers: req.session.user}}
    }
    EventService.addUserToEvent(req.body.event, data, event.defaultCallback)
}

exports.eventInfo = (req, res) => {
    EventService.getEventById(req.params.uuid, event.defaultCallback)
}

exports.searchEventByName = (req, res) => {
    EventService.searchEvent(req.params.data,(response)=>{
        network.resultWithJSON(res,response)
    }, (err) => {
        network.internalError(res, err)
    })
}

exports.getEvents = (req, res) => {
    var query = "?";
    for (key in req.query) {
        query += `${key}=${req.query[key]}&`        
      }
    EventService.getEvent(query, response => {
        network.replayResponse(response, res);
    })
}

exports.createEvent = (req, res) => {
    var event = req.body;
    event.organizator = req.session.user;
    EventService.newEvent(event, (response)=>{
        if (event.public) {
            axios.get(`${UserServiceHostPort}/users/${req.session.user}/linkedUsers`)
                .then(resLinkedUsers => {
                    resLinkedUsers.forEach(user => {
                        axios.post(`${UserServiceHostPort}/users/${user}/notifications`, {typology: 6, sender: req.session.user})
                    })
                })
        }
        network.resultWithJSON(res,response)
    }, (err) => {
        network.internalError(res, err)
    })
}