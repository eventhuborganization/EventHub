const network = require('./network');
const axios = require('axios');

const UserServiceHostPort = 'http://' + UserServiceHost + ':' + UserServicePort

exports.getLogin = (req, res) => {
    res.sendFile(`${appRoot}/views/login.html`)
}

exports.login = (req, res) => {
    axios.post(`${UserServiceHostPort}/users/credential`, req.body)
    .then((response) => {
        req.session.user = response._id
        network.replayResponse(response, res);
    })
    .catch((err) => {
        network.internalError(res, err)
    });
}

exports.logout = (req, res) => {
    res.clearCookie('user_sid');
    network.resultWithJSON(res, {data: 'user logout'})
}

exports.registration = (req, res) => {
    axios.post(`${UserServiceHostPort}/users`, req.body)
        .then((response) => {
            network.replayResponse(response, res);
        })
        .catch((err) => {
            network.internalError(res, err);
        });
}