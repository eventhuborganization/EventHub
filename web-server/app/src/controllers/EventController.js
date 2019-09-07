const network = require('./network')
const event = require('../API/EventServiceAPI.js')
const UserService = require('../API/UserServiceAPI')
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
            response => {
                network.replayResponse(response, res)
            },
            error => network.replayError(error, res))
}

exports.removeUserToEvent = (req, res) => {
    EventService.removeUserToEvent(req.body.event, formatUserForEvent(req),
            response => network.replayResponse(response, res),
            error => network.replayError(error, res))
}

exports.eventInfo = (req, res) => {
    EventService.getEventById(req.params.uuid, response => {
        let event = response.data
        axios.get(`${UserServiceServer}/users/${event.organizator}`)
        .then(organizator => {
            event.organizator = organizator.data 
            network.resultWithJSON(res, event)
        })
        .catch(err => {
            network.internalError(res, err)
        })
    }, err => network.internalError(res, err))
}

exports.eventCompleteInfo = (req, res) => {
    EventService.getEventById(req.params.uuid, response => {
        let event = response.data;
        var organization = axios.get(`${UserServiceServer}/users/${event.organizator}`)
        var participant = []
        var follower = []
        if(event.participants){
            participant = event.participants.map(p =>  axios.get(`${UserServiceServer}/users/${p}`))
        }
        if(event.followers){
            follower = event.followers.map(f =>  axios.get(`${UserServiceServer}/users/${f}`))
        }
        //Aggancio callback a tutte le richieste di info al servizio utenti
        Promise.all([Promise.all(participant), Promise.all(follower), organization])
        .then(responses => {
            //Aggiungo info dei partecipanti alle info dell'evento
            event.participants = event.follower.map(userId => {
                responses[0].data.find(user => user._id === userId)
            })
            //Aggiungo info dei follower alle info dell'evento
            event.followers = event.follower.map(userId => {
                responses[1].data.find(user => user._id === userId)
            })
            network.resultWithJSON(res, event)
        })
        .catch(err => {
            network.internalError(res, {
                description: "Un piccolo errore in \n >EventControlle.js->findFriendParticipant\n",
                error: err
            })
        })
    }, err => network.internalError(res, err))
}

exports.searchEventByName = (req, res) => {
    EventService.searchEvent(
        req.params.name,
        req.query,
        response => {
            let result = response.data.filter(event => event.public)
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
        let result = response.data.filter(event => event.public)
            .sort((a, b) => a.eventDate - b.eventDate)
            .slice(req.params.fromIndex, req.params.fromIndex + 10)
        let promises = result.map(event => axios.get(`${UserServiceServer}/users/${event.organizator}`))

        axios.all(promises)
            .then(usersResponse => {
                usersResponse.map(user => user.data).forEach(user => {
                    let ev = result.find(event => event.organizator === user._id)
                    ev.organizator = {
                            name: user.name,
                            surname: user.surname, 
                            avatar: user.profilePicture, 
                            _id: user._id, 
                            organization: user.organization,
                            city: user.address.city
                    }
                })
                network.resultWithJSON(res, result)
            })
            .catch(err => network.replayError(err, res))
    }, err => network.replayError(err, res))
}

exports.getEventsNear = (req, res) => {
    EventService.getEvent(req.query,
            response => {
                let events = response.data.filter(event => event.public)
                network.resultWithJSON(res, events)
            },
            error => network.replayError(error, res))
}
exports.createEvent = (req, res) => {
    let tempPath = req.file.path
    let event = req.body
    event.location = {
        lat: event.locationLat,
        lng: event.locationLng,
        address: event.locationAddress 
    }
    event.thumbnail = path.extname(req.file.originalname).toLowerCase()
    event.organizator = req.user._id
    EventService.newEvent(event, (response) => {
        UserService.addAction(req.user._id, 3)
        let finalEvent = response.data
        let imageName = finalEvent.thumbnail
        let targetPath = path.join(__dirname, ("../../public/images/events/" + imageName))
        fs.rename(tempPath, targetPath, error => {
            if (error) {
                console.log(error)
                tryDeleteEvent(req.user.id, response.data._id, error, 5)
                network.internalError(res, error)
            } else {
                axios.post(`${UserServiceServer}/users/${req.user._id}/events`,{organizator: finalEvent._id})
                    .then(() => {
                        if (finalEvent.public) {
                            axios.get(`${UserServiceServer}/users/${req.user._id}`)
                                .then(user => {
                                    if (user.data.organization) {
                                        axios.get(`${UserServiceServer}/users/${req.user._id}/linkedUsers`)
                                            .then(resLinkedUsers => {
                                                resLinkedUsers.data.linkedUsers.forEach(user =>{
                                                    sendNotification(user, {typology: 6, sender: req.user._id, data: {event: finalEvent}}, 5)
                                                })
                                            })
                                            .catch(() => {})
                                    }
                                })
                                .catch(() => {})
                        }
                        network.resultWithJSON(res,response.data)
                    })
                    .catch(err => network.replayError(err, res))
            }
        })
    }, (err) => {
        console.log(err)
        network.internalError(res, err)
    })
}

exports.updateEvent = (req, res) => {
    let message = {'organizator': req.user._id}
    let event = JSON.parse(req.body.data)
    if (event.name)
        message.name = event.name
    if (event.description)
        message.description = event.description
    if (event.date)
        message.date = event.date
    if (event.location){
        event.location.lat = parseFloat(event.location.lat, 10)
        event.location.lng = parseFloat(event.location.lng, 10)
        if (!isNaN(event.location.lat) && !isNaN(event.location.lng) && event.location.address)
            message.location = event.location
    } 
    if (event.maxParticipants) {
        event.maxParticipants = parseInt(event.maxParticipants,10)    
        if (!isNaN(event.maxParticipants))
            message.maximumParticipants = event.maxParticipants
    }
    if (req.file) {
        message.thumbnail = req.params.uuid + Date.now() + path.extname(req.file.originalname).toLowerCase()
        let targetPath = path.join(__dirname, ("../../public/images/events/" + message.thumbnail))
        fs.rename(req.file.path, targetPath, error => {
            if (error) {
                network.internalError(res, error)
            }
        })
    }    
    EventService.updateEventById(req.params.uuid, message, 
        response => {
            let event = response.data
            network.replayResponse(response, res)
            let users = new Set(event.participants.concat(event.followers))
            users.forEach(userId => {
                sendNotification(userId, {typology: 7, sender: req.user._id, data: {event: event}}, 5)
            })
        }, error => network.replayError(error, res))
}



exports.deleteEvent = (req, res) => {
    EventService.deleteEvent(req.params.uuid, req.user._id, 
        response => {            
            let event = response.data
            axios.delete(`${UserServiceServer}/users/${req.user._id}/events`,{data: {organizator: event._id}})
                .then(() => {
                    network.replayResponse(response,res)
                    let users = new Set(event.participants.concat(event.followers))
                    users.forEach(userId => {
                        deleteEventToUser(userId, event, 5)
                    })
                })
                .catch(error => network.replayError(error, res))
        }, error => network.replayError(error, res))
}

exports.getEventsByOrganizator = (req, res) => {
    axios.get(`${UserServiceServer}/users/${req.params.uuid}`)
        .then(resultUser => {
            let user = resultUser.data
            let organizator = {
                name: user.name,
                surname: user.surname,
                avatar: user.profilePicture,
                _id: user._id,
                organization: user.organization,
                city: user.address.city
            }
            let events = user.eventsOrganized || []
            events = events.map(ev => axios.get(`${EventServiceServer}/events/${ev}`))
            Promise.all(events)
                .then(result => {
                    let response = result.map(data => {
                        let event = data.data
                        event.organizator = organizator
                        return event
                    })
                    response.sort((a,b) => a.eventDate < b.eventDate)
                    network.resultWithJSON(res, response)
                })
                .catch(error => network.replayError(error, res))
        })
        .catch(err => {
            network.replayError(err, res)
        })
}

var sendNotification = (userId, notification, counter) => { //{typology: 7, sender: sender, data: event}
    axios.post(`${UserServiceServer}/users/${userId}/notifications/`, notification)
        .then(() => {})
        .catch(()=> {
            if (counter>0)
                sendNotification(userId, notification, --counter)
        })
}

var tryDeleteEvent = (userId, eventId, error, counter) => { 
    EventService.deleteEvent(eventId, userId, 
        response => {}, 
        error => {if (counter>0) tryDeleteEvent(userId,eventId, --counter)})
}

var deleteEventToUser = (userId, event, counter) => {
    axios.delete(`${UserServiceServer}/users/${userId}/events`, {data: {participant: event._id, follower: event._id}})
        .then(() => {sendNotification(userId,{typology: 11, sender: req.user._id, data: {event: event}}, 5)})
        .catch(()=> {
            if (counter>0)
                deleteEventToUser(userId, eventId, --counter)
        })
}