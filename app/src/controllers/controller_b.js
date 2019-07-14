const network = require('./network');
const axios = require('axios');
const event = require('../EventService.js')

const EventService = new event.EventService(EventServiceHost, EventServicePort)

exports.getLogin = (req, res) => {
    res.sendFile(appRoot  + '/views/login.html')
}

exports.login = (req, res) => {
    axios.post('http://' + UserServiceHost + ':' + 
        UserServicePort + '/users/credential', req.body)
    .then((response) => {
        req.session.user = response._id
        network.resultWithJSON(res, {data: 'user logged'})
    })
    .catch((err) => {
        network.internalError(res, err)
    });
}

exports.logout = (req, res) => {
    res.clearCookie('user_sid');
    network.resultWithJSON(res, {data: 'user logout'})
}

exports.addEventUser = (req, res) => {
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
/**
 * 
 * TODO: da capire la richiesta di amicizia che tipologia di notifica è
 */
exports.userFriendRequest = (req, res) => {
    var data = {tipology: 1, sender: req.session.user}
    axios.post('http://' + UserServiceHost + ':' + 
        UserServicePort + `/users/${req.body.user}`, data)
    .then((response) => {
        network.result(res)
    })
    .catch((err) => {
        network.internalError(res, err)
    })
}

exports.markNotificationAsReaded = (req, res) => {
    axios.post('http://' + UserServiceHost + ':' + 
        UserServicePort + `/users/${req.session.user}/notifications/${req.body._id}`, data)
    .then((response) => {
        network.result(res)
    })
    .catch((err) => {
        network.internalError(res, err)
    })
}

exports.searchEventByName = (req, res) => {
    
}

