const network = require('./network');
const axios = require('axios');
const event = require('../EventService.js')

const EventService = new Event.EventService(app.get('EventServiceHost'), app.get('EventServicePort'));

exports.login = (req, res) => {
    axios.post('http://' + app.get('UserServiceHost') + ':' + 
        app.get('UserServiceHost') + '/users/credential', req.body)
    .then((response) => {
        req.session.user = response._id
        res.redirect('/')
    })
    .catch((err) => {
        network.internalError(res, err);
    });
}

exports.logout = (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
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
    axios.post('http://' + app.get('UserServiceHost') + ':' + 
        app.get('UserServiceHost') + `/users/${req.body.user}`, data)
    .then((response) => {
        network.result(res);
    })
    .catch((err) => {
        network.internalError(res, err);
    });
}

