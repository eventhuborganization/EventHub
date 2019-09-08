const axios = require('axios')

exports.getUserInfo = (uuid) => {
    return axios.get(`${UserServiceServer}/users/${uuid}`)
} 

exports.addLinkedUser = (data) => {
    return axios.post(`${UserServiceServer}/users/linkedUsers`, data)
}
exports.removeLinkedUser = (data) => {
    return axios.delete(`${UserServiceServer}/users/linkedUsers`, {data: data})
}

exports.createGroup = (data) => {
    return axios.post(`${UserServiceServer}/groups`, data)
}

exports.getGroupInfo = (uuid) => {
    return axios.get(`${UserServiceServer}/groups/${uuid}`)
}
exports.deleteGroup = (uuid) => {
    return axios.delete(`${UserServiceServer}/groups/${uuid}`)
}

exports.getBadgePoints = (uuid) => {
    return axios.get(`${UserServiceServer}/users/${uuid}/levels`)
}

exports.getEventInfo = (uuid) => {
    return axios.get(`${EventServiceServer}/events/${uuid}`);
}

exports.getReviewsWritten = (uuid) => {
    return axios.get(`${UserServiceServer}/users/${uuid}/reviews/written`)
}

exports.getReviewsReceived = (uuid) => {
    return axios.get(`${UserServiceServer}/users/${uuid}/reviews/received`)
}

exports.getEventReviews = (uuid) => {
    return axios.get(`${UserServiceServer}/events/${uuid}/reviews`)
}

exports.sendNotification = (receiver, data) => {
    return axios.post(`${UserServiceServer}/users/${receiver}/notifications`,data)
}

exports.readNotification = (user, notification) =>{
    return  axios.put(`${UserServiceServer}/users/${user}/notifications/${notification}`, {})
}

exports.addAction = (
    user, type, 
    doThen = () => console.log("yeee"), 
    doOnError = () => {}, 
    counter = 3
) => {
    axios.post(`${UserServiceServer}/users/${user}/actions`, {typology: type})
    .then(doThen)
    .catch(err => {
        console.log(err)
        if(counter>0){
            this.addAction(user, type, doThen, doOnError, --counter)
        } else {
            doOnError(err)
        }
    })
}