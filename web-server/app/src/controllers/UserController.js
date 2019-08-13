const network = require('./network');
const axios = require('axios');

const UserServiceHostPort = 'http://' + UserServiceHost + ':' + UserServicePort
const EventServiceHostPort = 'http://' + EventServiceHost + ':' + EventServicePort


exports.removeLinkedUser = (req, res) => {
    let data = {uuid1: req.body.friend, uuid2: req.session.user}
    axios.delete(`${UserServiceHostPort}/users/linkedUsers`, {data: data})
        .then((response) => network.replayResponse(response, res))
        .catch(err => network.replayError(err, res))
}

exports.inviteFriends = (req, res) => {
    var data = {typology: 0, sender: req.session.user}
    axios.post(`${UserServiceHostPort}/users/${req.body.user}`, data)
    .then((response) => {
        network.result(res)
    })
    .catch((err) => {
        network.internalError(res, err)
    })
}


exports.userFriendRequest = (req, res) => {
    var data = {typology: 1, sender: req.session.user}
    axios.post(`${UserServiceHostPort}/users/${req.body.friend}/notifications`, data)
        .then(() => network.result(res))
        .catch((err) => network.internalError(res, err))
}

exports.friendshipAnswer = (req, res) => {
    if (req.body.accepted) {
        axios.post(`${UserServiceHostPort}/users/linkedUsers`, {uuid1: req.body.friend, uuid2: req.session.user})
            .then(() => {
                return axios.post(`${UserServiceHostPort}/users/${req.body.friend}/notifications/`, {typology: 8, sender: req.session.user})
            })
            .then(() => {
                return axios.put(`${UserServiceHostPort}/users/${req.session.user}/notifications/${req.body._id}`, {})
            })
            .then(response => {
                network.replayResponse(response, res);
            })
            .catch (error => {
                console.log(error)
                network.internalError(res, error);
            })
    } else {
        axios.put(`${UserServiceHostPort}/users/${req.session.user}/notifications/${req.body._id}`, {})
            .then(response => {
                network.replayResponse(response, res);
            })
            .catch (error => {
                network.internalError(res, error);
            })
    }
}

exports.requestFriendPosition = (req, res) => {
    if (req.body.accepted) {
        axios.post(`${UserServiceHostPort}/users/${req.body.friend}/notifications`, {
            typology: 4, 
            sender: req.session.user, 
        })
        .then( response => {
            network.replayResponse(response, res);
        })
        .catch (error => {
            network.internalError(res, error);
        });
    }
}

exports.responseFriendPosition = (req, res) => {
    if (req.body.accepted) {
        axios.post(`${UserServiceHostPort}/users/${req.body.friend}/notifications`, {
            typology: 9, 
            sender: req.session.user, 
            data: {
                lat: req.body.position.lat, 
                lon: req.body.position.lon
            }
        })
        .then( response => {
            network.replayResponse(response, res);
        })
        .catch (error => {
            network.internalError(res, error);
        });
    }
}


exports.updateProfile = (req, res) => {
    let user = req.session.user
    axios.put(`${UserServiceHostPort}/users/${user}`, req.body)
        .then((response) => {
            network.replayResponse(response, res);
        })
        .catch((err) => {
            network.internalError(res, err);
        });
}

exports.updateCredentials = (req, res) => {
    axios.put(`${UserServiceHostPort}/users/credentials`, req.body)
        .then((response) => {
            network.replayResponse(response, res);
        })
        .catch((err) => {
            network.internalError(res, err);
        });
}

/* user: {name, surname, avatar, gender, birthdate, phone, email, organization, 
    linkedUsers: [{_id, name, city, avatar, oganization}], groups:[{_id, name}], 
    badges(last 3): [{name, icon, _id}], points, n.reviewDone, n.reviewReceived, 
    eventsSubscribed(last k attended + next k that he wants to participate), eventsFollowed(future events)}*/
exports.getInfoUser = (req, res) => {
    try {
        axios.get(`${UserServiceHostPort}/users/${req.params.uuid}`)
        .then( resComplete => {
            let response = resComplete.data
            response.avatar = response.profilePicture
            delete response.profilePicture 
            linkedUsersPromise = []
            response.linkedUsers.forEach(user => {
                linkedUsersPromise.push(exports.getLinkedUserInfo(user))
            })
            groupsPromise = []
            response.groups.forEach(group => {
                groupsPromise.push(exports.getGroupInfo(group))
            })
            eventsSubscribedPromise = []
            response.eventsSubscribed.forEach(event => {
                eventsSubscribedPromise.push(exports.getEventInfo(event))
            })
            eventsFollowedPromise = []
            response.eventsFollowed.forEach(event => {
                eventsFollowedPromise.push(exports.getEventInfo(event))
            })
            Promise.all([Promise.all(linkedUsersPromise), Promise.all(groupsPromise), exports.getBadgePoints(req.params.uuid), Promise.all(eventsSubscribedPromise), Promise.all(eventsFollowedPromise)])
            .then( result => {
                response.linkedUsers = []
                result[0].map(obj => obj.data).forEach(user => {
                    response.linkedUsers.push({
                        name: `${user.name} ${user.surname}`, 
                        avatar: user.profilePicture, 
                        _id: user._id, 
                        organization: user.organization,
                        city: user.address.city
                    })
                })
                response.groups = []
                result[1].map(obj => obj.data).forEach(group => {
                    response.groups.push({ _id: group._id, name: group.name })
                })
                response.badges = result[2].data.badge
                response.reviewsDone = response.reviewsDone.length
                response.reviewsReceived = response.reviewsReceived.length
                let sortFunction = (a,b) => {  
                    if(a.EventDate < b.EventDate) 
                        return -1
                    if(a.EventDate > b.EventDate) 
                        return 1
                    return 0
                }
                result[3] = result[3].map(obj => obj.data).sort(sortFunction)
                result[4] = result[4].map(obj => obj.data).sort(sortFunction)
                let k = 3 //numero di eventi da mostrare
                response.lastEventSubscribed = []
                response.nextEventSubscribed = []
                response.nextEventSubscribed = []
                if(result[3].length > 0){
                    let indexSub = 0
                    //find first index of an event that has to occur yet
                    while(new Date(result[3][indexSub].EventDate) < Date.now() && indexSub < result[3].length){
                        indexSub++
                    }
                    for (var count=1; count<=k && (indexSub-count)>=0; count++) {
                        response.lastEventSubscribed.push(result[3][indexSub-count])
                    }
                    for (var count=0; count<k && (indexSub+count)<result[3].length; count++) {
                        response.nextEventSubscribed.push(result[3][indexSub+count])
                    }
                }
                if(result[4].length > 0){
                    let indexFol = 0
                    //find first index of an event that has to occur yet
                    while(new Date(result[4][indexFol].EventDate) < Date.now() && indexSub < result[4].length){
                        indexFol++
                    }
                    for (var count=0; count<k && (indexFol+count)<result[4].length; count++) {
                        response.nextEventFollowed.push(result[4][indexFol+count])
                    }
                }         
                network.resultWithJSON(res, response)
            })
        })
        .catch(err => {
            network.internalError(res, err)
        })
    } catch (err) {
        console.log(err)
    }
}

/* user: {_id, name, surname, avatar, city, organization}*/
exports.getLightweightInfoUser = (req, res) => {
    axios.get(`${UserServiceHostPort}/users/${req.params.uuid}`)
        .then(resComplete => {
            let user = resComplete.data
            network.resultWithJSON(res, {
                name: user.name,
                surname: user.surname, 
                avatar: user.profilePicture, 
                _id: user._id, 
                organization: user.organization,
                city: user.address.city
            })
        })
        .catch(err => {
            network.internalError(res, err)
        })
}

exports.searchUser = (req, res) => {
    axios.get(`${UserServiceHostPort}/users/search/${req.params.name}`, req.body)
        .then((response) => network.resultWithJSON(res, {users: response.data}))
        .catch((err) => network.internalError(res, err))
}

exports.getLinkedUserInfo = (uuid) => {
    return axios.get(`${UserServiceHostPort}/users/${uuid}`)
}

exports.getGroupInfo = (uuid) => {
    return axios.get(`${UserServiceHostPort}/group/${uuid}`)
}

exports.getBadgePoints = (uuid) => {
    return axios.get(`${UserServiceHostPort}/users/${uuid}/levels`)
}

exports.getEventInfo = (uuid) => {
    return axios.get(`${EventServiceHostPort}/events/${uuid}`);
}

exports.getReviewsWritten = (uuid) => {
    return axios.get(`${UserServiceHostPort}/users/${uuid}/reviews/written`)
}

exports.getReviewsReceived = (uuid) => {
    return axios.get(`${UserServiceHostPort}/users/${uuid}/reviews/received`)
}