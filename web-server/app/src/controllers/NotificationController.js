const network = require('./network');
const axios = require('axios');

function getUserInfo(uuid){
    return axios.get(`${UserServiceServer}/users/${uuid}`)
}

exports.markNotificationAsRead = (req, res) => {
    axios.put(`${UserServiceServer}/users/${req.user._id}/notifications/${req.body._id}`, {})
    .then(() => network.result(res))
    .catch((err) => network.internalError(res, err))
}

exports.getNotification = (req,res) => {
    axios.get(`${UserServiceServer}/users/${req.user._id}/notifications/${req.params.fromIndex}`)
        .then((response) => {
            let notifications = response.data.notifications
            let userInfo = notifications.map(not => getUserInfo(not.sender))
            let eventInfo = notifications.map(not => {
                if(not.data.eventId){
                    return axios.get(`${EventServiceServer}/events/${not.data.eventId}`)
                } else {
                    return Promise.resolve()
                }
            })
            Promise.all([Promise.all(userInfo), Promise.all(eventInfo)])
                .then(result => {
                    notifications = notifications.map(not => {
                        let newNotification = not
                        //save complete informations about the sender
                        newNotification.sender = result[0].filter(res => res.data._id === not.sender)[0].data
                        //if the event info are incomplete, save complete informations about the event
                        if(newNotification.data.eventId){
                            newNotification.data.event = result[1].filter(ev => ev.data._id === newNotification.data.eventId)[0].data
                        }
                        return newNotification
                    })
                    network.resultWithJSON(res, {notifications: notifications})
                })
                .catch(err => network.internalError(res, err))
        })
        .catch(err => network.internalError(res, err))
}