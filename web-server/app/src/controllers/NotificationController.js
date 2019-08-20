const network = require('./network');
const axios = require('axios');

const UserServiceHostPort = global.UserServiceServer

function getUserInfo(uuid){
    return axios.get(`${UserServiceHostPort}/users/${uuid}`)
}

exports.markNotificationAsReaded = (req, res) => {
    axios.put(`${UserServiceHostPort}/users/${req.user._id}/notifications/${req.body._id}`, {})
    .then((response) => {
        network.result(res)
    })
    .catch((err) => {
        network.internalError(res, err)
    })
}

exports.getNotification = (req,res) => {
    axios.get(`${UserServiceHostPort}/users/${req.user._id}/notifications/${req.params.fromIndex}`)
        .then((response) => {
            let notifications = response.data.notifications
            let userInfo = notifications.map(not => getUserInfo(not.sender))
            Promise.all(userInfo)
                .then(result => {
                    notifications = notifications.map(not => {
                        let newNotification = not
                        //save complete informations about the sender
                        newNotification.sender = result.filter(res => res.data._id === not.sender)[0].data
                        return newNotification
                    })
                    network.resultWithJSON(res, {notifications: notifications})
                })
                .catch(err => {
                    console.log(err)
                    network.internalError(res, err)
                })
        })
        .catch((err) => {console.log(err); network.internalError(res, err)})
}