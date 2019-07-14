let network = require('./network');
let axios = require("axios");


exports.getHome = (req, res) => {
    res.sendFile(appRoot  + '/views/home.html');
}

exports.getEvents = (req, res) => {
    
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

exports.getInfoUser = (req, res) => {
    
}

exports.searchUser = (req, res) => {
    
}