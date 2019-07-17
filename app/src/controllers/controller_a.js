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

exports.createEvent = (req, res) => {
    EventService.newEvent(req.body, (response)=>{
        network.resultWithJSON(res,response)
    }, (err) => {
        network.internalError(res, err)
    })
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
            eventsSubscribedPromise = []
            response.eventsSubscribed.forEach(function(event) {
                eventsSubscribedPromise.push(exports.getEventInfo(event))
            })
            eventsFollowedPromise = []
            response.eventsFollowed.forEach(function(event) {
                eventsFollowedPromise.push(exports.getEventInfo(event))
            })
            Promise.all([Promise.all(linkedUsersPromise), Promise.all(groupsPromise), exports.getBadgePoints(req.params.uuid), Promise.all(eventsSubscribedPromise), Promise.all(eventsFollowedPromise)])
                .then( result => {
                    response.linkedUsers = []
                    result[0].forEach(function(user) {
                        response.linkedUsers.push({name: user.name, surname: user.surname, avatar: user.profilePicture, _id: user._id })
                    })
                    response.groups = []
                    result[1].forEach(function(group) {
                        response.linkedUsers.push({ _id: group._id, name: group.name })
                    })
                    response.badges = result[2];
                    response.reviewsDone = response.reviewsDone.length;
                    response.reviewsReceived = response.reviewsReceived.length;
                    function sortFunction(a,b) {  
                        var keyA = new Date(a.EventDate),
                            keyB = new Date(b.EventDate);
                        if(keyA < keyB) return -1;
                        if(keyA > keyB) return 1;
                        return 0;
                    }
                    result[3].sort(sortFunction);
                    result[4].sort(sortFunction);
                    let indexSub = 0;
                    let indexFol = 0;
                    for(; new Date(result[3][indexSub].EventDate) < Data.now(); indexSub++)
                    for(; new Date(result[4][indexFol].EventDate) < Data.now(); indexFol++)
                    let k = 3 //numero di eventi da mostrare
                    response.lastEventSubscribed = [];
                    response.nextEventSubscribed = [];
                    response.nextEventSubscribed = [];
                    for (var count=1; count<=k && (indexSub-count)>=0; count++) {
                        response.lastEventSubscribed.push(result[3][indexSub-count]);
                    }
                    for (var count=0; count<k && (indexSub+count)<result[3].length; count++) {
                        response.nextEventSubscribed.push(result[3][indexSub+count]);
                    }
                    for (var count=0; count<k && (indexFol+count)<result[4].length; count++) {
                        response.nextEventFollowed.push(result[4][indexFol+count]);
                    }
                    network.resultWithJSON(res, response);
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
    return axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + uuid + '/levels')
}

exports.getReviewsWritten = (uuid) => {
    return axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + uuid + '/reviews/written');
}

exports.getReviewsReceived = (uuid) => {
    return axios.get('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + uuid + '/reviews/received');
}

exports.getEventInfo = (uuid) => {
    return axios.get('http://' + app.get('EventServiceHost') + ':' + app.get('EventServicePort') + '/events/' + uuid);
}