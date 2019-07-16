let network = require('./network');
let axios = require("axios");
const event = require('../EventService.js')

const EventService = new event.EventService(EventServiceHost, EventServicePort)


exports.getHome = (req, res) => {
    res.sendFile(appRoot  + '/views/home.html');
}

exports.getEvents = (req, res) => {
    var query = "?";
    for (key in req.query) {
        query = query + key + "=" + req.query[key] + "&"        
      }
    EventService.getEvent(query, response => {
        network.replayResponse(response, res);
    })
}

exports.friendshipAnswer = (req, res) => {
    if (req.body.accepted) {
        axios.post('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/linkedUsers', {uuid1: req.body.friend, uuid2: req.session.user})
            .then( response => {
                network.replayError(response, res);
                axios.post('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + req.body.friend + '/notifications', {tipology: 8, sender: req.session.user})
                    .catch (error => {
                        network.internalError(res, error);
                    });
                network.replayResponse(response, res);
            })
            .catch( error => {
                network.internalError(res, error);
            })
    }
}

exports.getFriendPosition = (req, res) => {
    if (req.body.accepted) {
        axios.post('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + req.body.friend + '/notifications', {tipology: 9, sender: req.session.user, position: {lat: req.body.position.lat, lon: req.body.position.lon}})
            .then( response => {
                network.replayResponse(response, res);
            })
            .catch (error => {
                network.internalError(res, error);
            });
    }
}

exports.registration = (req, res) => {
    axios.post('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users', req.body)
        .then((response) => {
            network.replayResponse(response, res);
        })
        .catch((err) => {
            network.internalError(res, err);
        });
}

exports.updateProfile = (req, res) => {
    axios.put('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + req.params.uuid, req.body)
        .then((response) => {
            network.replayResponse(response, res);
        })
        .catch((err) => {
            network.internalError(res, err);
        });
}

exports.updateCredentials = (req, res) => {
    axios.put('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/credentials' + req.params.uuid, req.body)
        .then((response) => {
            network.replayResponse(response, res);
        })
        .catch((err) => {
            network.internalError(res, err);
        });
}


/* user: {name, surname, gender, birthdate, phone, email, organization, 
    linkedUsers: [{_id, name, surname, avatar}], groups:[{_id, name}], 
    badges(last 3): [{name, icon, _id}], points, n.reviewDone, n.reviewReceived, 
    eventsSubscribed(last k attended + next k that he wants to participate), eventsFollowed(future events)}*/
exports.getInfoUser = (req, res) => {
    axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + req.params.uuid)
        .then( response => {
            linkedUsersPromise = []
            response.linkedUsers.forEach(function(user) {
                linkedUsersPromise.push(exports.getLinkedUserInfo(user))
            })
            groupsPromise = []
            response.groups.forEach(function(group) {
                groupsPromise.push(exports.getGroupInfo(group))
            })
            //axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + req.params.uuid + '/events);
            Promise.all([Promise.all(linkedUsersPromise), Promise.all(groupsPromise), exports.getBadgePoints(req.params.uuid), exports.getReviewsWritten(req.params.uuid), exports.getReviewsReceived(req.params.uuid)])
                .then( result => {
                    response.linkedUsers = []
                    result[0].forEach(function(user) {
                        response.linkedUsers.push({name: user.name, surname: user.surname, avatar: user.profilePicture, _id: user._id })
                    })
                    response.groups = []
                    result[1].forEach(function(group) {
                        response.linkedUsers.push({ _id: group._id, name: group.name })
                    })
                })
        })
        .catch(err => {
            network.internalError(res, err);
        })
}

exports.searchUser = (req, res) => {
    exports.registration = (req, res) => {
        axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/search/' + req.params.name, req.body)
            .then((response) => {
                network.replayResponse(response, res);
            })
            .catch((err) => {
                network.internalError(res, err);
            });
    }
}

exports.getLinkedUserInfo = (uuid) => {
    return axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + uuid);
}

exports.getGroupInfo = (uuid) => {
    return axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/group/' + uuid);
}

exports.getBadgePoints = (uuid) => {
    return axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + uuid + '/levels');
}

exports.getReviewsWritten = (uuid) => {
    return axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + uuid + '/reviews/written');
}

exports.getReviewsReceived = (uuid) => {
    return axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + uuid + '/reviews/received');
}