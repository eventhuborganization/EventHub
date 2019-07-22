const network = require('./network');
const axios = require('axios');

const UserServiceHostPort = 'http://' + UserServiceHost + ':' + UserServicePort

exports.markNotificationAsReaded = (req, res) => {
    axios.post(`${UserServiceHostPort}/users/${req.session.user}/notifications/${req.body._id}`, data)
    .then((response) => {
        network.result(res)
    })
    .catch((err) => {
        network.internalError(res, err)
    })
}

exports.getNotification = (req,res) => {
    axios.get(`${UserServiceHostPort}/users/${req.session.user}/notifications/${req.params.fromIndex}`)
    .then((response) => {
        network.resultWithJSON(res, response)
    })
    .catch((err) => {
        network.internalError(res, err)
    })
}