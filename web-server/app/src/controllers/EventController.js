const network = require('./network')
const event = require('../API/EventServiceAPI.js')
const axios = require('axios')
const path = require('path')
const fs = require("fs")

const EventService = new event.EventService(EventServiceHost, EventServicePort)

function formatUserForEvent (req) {
    let data = {}
    if(req.body.participant){
        data = {user: {participants: req.user._id}}
    } else if(req.body.follower){
        data = {user: {followers: req.user._id}}
    }
    return data
}

exports.addUserToEvent = (req, res) => {
    EventService.addUserToEvent(req.body.event, formatUserForEvent(req),
            response => network.replayResponse(response, res),
            error => network.replayError(error, res))
}

exports.removeUserToEvent = (req, res) => {
    EventService.removeUserToEvent(req.body.event, formatUserForEvent(req),
            response => network.replayResponse(response, res),
            error => network.replayError(error, res))
}

exports.eventInfo = (req, res) => {
    EventService.getEventById(req.params.uuid, response => {
        let event = response.data;
        axios.get(`${UserServiceServer}/users/${event.organizator}`)
            .then(organizator => {
                event.organizator = organizator.data;
                network.resultWithJSON(res, event)
            })
            .catch(err => {
                network.internalError(res, err)
            })
    }, err => network.internalError(res, err))
}

exports.searchEventByName = (req, res) => {
    EventService.searchEvent(
        req.params.name,
        req.query,
        response => {
            let result = response.data
            let promises = result.map(event => axios.get(`${UserServiceServer}/users/${event.organizator}`))
            axios.all(promises)
            .then(usersResponse => {
                usersResponse.map(user => user.data).forEach(user => {
                    let ev = result.find(event => event.organizator === user._id)
                    ev.organizator = user
                })
                network.resultWithJSON(res, result);
            })
            .catch(err => network.replayError(err, res))
        },
        err => {
            network.replayError(err, res)
        })
}

exports.getEventsFromIndex = (req, res) => {
    EventService.getEvent(req.query, response => {
        response.data.sort((a, b)=>{
            return a.eventDate - b.eventDate
        })
        // slice(from: escluso, to: incluso)
        var result = response.data.slice(req.params.fromIndex, req.params.fromIndex + 10)
        var promises = result.map(event => axios.get(`${UserServiceServer}/users/${event.organizator}`))
        axios.all(promises)
            .then(usersResponse => {
                usersResponse.map(user => user.data).forEach(user => {
                    let ev = result.find(event => event.organizator === user._id)
                    ev.organizator = user
                })
                network.resultWithJSON(res, result)
            })
            .catch(err => network.replayError(err, res))
    }, err => network.replayError(err, res))
}

exports.getEventsNear = (req, res) => {
    EventService.getEvent(req.query,
            response => network.replayResponse(response, res),
            error => network.replayError(error, res))
}
exports.createEvent = (req, res) => {
    var tempPath = req.file.path
    var event = req.body
    event.location = {
        lat: event.locationLat,
        lng: event.locationLng,
        address: event.locationAddress 
    }
    event.thumbnail = path.extname(req.file.originalname).toLowerCase()
    event.organizator = req.user._id
    EventService.newEvent(event, (response) => {
        let imageName = response.data.thumbnail
        let targetPath = path.join(__dirname, ("../../public/images/events/" + imageName))
        fs.rename(tempPath, targetPath, error => {
            if (error) {
                console.log(error)
                for(let notDone = 4; notDone; ) {
                    EventService.deleteEvent(response.data._id, response => {
                        notDone = false
                        network.internalError(res, error)
                    }, error => notDone--)
                }
                network.internalError(res, error)
            } else {
                if (event.public) {
                    axios.get(`${UserServiceServer}/users/${req.user._id}`)
                    .then(user => {
                        if (user.data.organization) {
                            axios.get(`${UserServiceServer}/users/${req.user._id}/linkedUsers`)
                            .then(resLinkedUsers => {
                                resLinkedUsers.forEach(user => {
                                    axios.post(`${UserServiceServer}/users/${user}/notifications`, {typology: 6, sender: req.user._id})
                                })
                            })
                        }
                    })
                }
                network.resultWithJSON(res,response.data)
            }
        })
    }, (err) => {
        console.log(err)
        network.internalError(res, err)
    })
}