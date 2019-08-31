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
    return axios.post(`${UserServiceServer}/group`, data)
}

exports.getGroupInfo = (uuid) => {
    return axios.get(`${UserServiceServer}/group/${uuid}`)
}
exports.deleteGroup = (uuid) => {
    return axios.delete(`${UserServiceServer}/group/${uuid}`)
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

exports.sendNotification = (receiver, data) => {
    return axios.post(`${UserServiceServer}/users/${receiver}/notifications`,data)
}

exports.readNotification = (user, notification) =>{
    return  axios.put(`${UserServiceServer}/users/${user}/notifications/${notification}`, {})
}