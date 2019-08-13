const network = require('./network');
const axios = require('axios');

const UserServiceHostPort = 'http://' + UserServiceHost + ':' + UserServicePort

exports.getLogin = (req, res) => {
    res.sendFile(`${appRoot}/views/login.html`)
}

exports.login = (req, res) => {
    axios.post(`${UserServiceHostPort}/users/credentials`, {data: req.body})
    .then((response) => {
        req.session.user = response.data._id
        network.replayResponse(response, res);
    })
    .catch((err) => {
        network.internalError(res, err)
    });
}

exports.logout = (req, res) => {
    req.session.destroy(err => {
        network.internalError(res,err);
    })
    res.clearCookie('user_sid');
    network.resultWithJSON(res, {data: 'user logout'})
}

exports.registration = (req, res) => {
    let data = req.body
    data.sex = data.gender
    data.phoneNumber = data.phone
    data.profilePicture = data.avatar
    delete data.gender
    delete data.phone
    delete data.avatar
    axios.post(`${UserServiceHostPort}/users`, {data: data})
        .then((response) => {
            network.replayResponse(response, res);
        })
        .catch((err) => {
            network.internalError(res, err);
        });
}