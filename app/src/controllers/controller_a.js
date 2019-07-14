let network = require('./network');
let axios = require("axios");


exports.getHome = (req, res) => {
    res.sendFile(appRoot  + '/view/home.html');
}

exports.getEvents = (req, res) => {
    
}

exports.friendshipAnswer = (req, res) => {
    
}

exports.getFriendPosition = (req, res) => {
    
}

exports.registration = (req, res) => {
    axios.post('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users', req.body)
        .then((response) => {
            network.replayResponse(response);
        })
        .catch((err) => {
            network.internalError(res, err);
        });
}

exports.updateProfile = (req, res) => {
    if (req.params.uuid === req.session.user) {
        axios.put('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/' + req.params.uuid, req.body)
            .then((response) => {
                network.replayResponse(response);
            })
            .catch((err) => {
                network.internalError(res, err);
            });
    } else {
        network.badRequestJSON(res, {description: "have to do login"})
    }
}

exports.updateCredentials = (req, res) => {
    axios.put('http://' + app.get('UserServiceHost') + ':' + app.get('UserServicePort') + '/users/credentials' + req.params.uuid, req.body)
        .then((response) => {
            network.replayResponse(response);
        })
        .catch((err) => {
            network.internalError(res, err);
        });
}

exports.getInfoUser = (req, res) => {
    
}

exports.searchUser = (req, res) => {
    
}

