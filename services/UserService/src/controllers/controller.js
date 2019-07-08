let mongoose = require('mongoose');
let request = require('request');
let commons = require('commons');
let security = require('security');

let Users = mongoose.model('Users');
let Reviews = mongoose.model('Reviews');
let Groups = mongoose.model('Groups');
let Actions = mongoose.model("Actions");
let Badges = mongoose.model("Badges");

const NUM_NOTIFICATIONS_TO_SHOW = 10;

/**
 * Get the user from an ID
 * @param {Schema.Types.ObjectId} userId the userId
 * @param {function(err, response)} callback the callback to call 
 */
function getUserById(userId, callback){
    Users.findById(userId, callback);
}

exports.createNewUser = (req, res) => {
    let newUser = req.body;
    if(!isNewUserWellFormed(newUser)) {
        res.status(400).end();
    } else {
        let password = hashPassword(newUser.password);
        newUser.salt = password.salt;
        newUser.password = password.pwd;
        let dbUser = new Users(newUser);
        dbUser.save(function(err, user) {
            if (err) {
                internalError(res, err);
            } else {
                userCreated(res, user);
            }
        });
    }
};

exports.deleteUser = (req, res) => {
    Users.deleteOne({ _id: req.params.uuid }, (err) => {
        if(err) {
            internalError(res, err);
        } else {
            result(res);
        }
    });
};

exports.userLogin = (req, res) => {
    let data = req.body;
    if(!isLoginDataWellFormed(data)) {
        userNotFound(res);
    } else {
        Users.findOne({ email: data.email }, function(err, user){
            if(err){
                internalError(res, err);
            } else if(user == null){
                userNotFound(res);
            } else {
                let pwd = sha512(req.params.password, user.salt);
                if(pwd === user.password) {
                    result(res);
                } else {
                    userNotFound(res);
                }
            }
        });
    }
};

exports.getUserInformations = (req, res) => {
    getUserById(req.params.uuid, function(err, user){
        if(err){
            internalError(res);
        } else if(user == null){
            userNotFound(res);
        } else {
            resultWithJSON(res, user);
        }
    });
};

exports.updateUserInformations = (req, res) => {
    let data = req.body;
    if(isUpdateUserDataWellFormed(data)){
        Users.findByIdAndUpdate(req.params.uuid, data, function(err, user){
            if(err){
                internalError(res);
            } else {
                result(res);
            }
        });
    } else {
        badRequest(res);
    }
};

exports.updateUserCredentials = (req, res) => {
    let data = req.body;
    if(!isLoginDataWellFormed(data)) {
        badRequest(res);
    } else {
        Users.findOne({ email: data.email }, function(err, user){
            if(err){
                internalError(res, err);
            } else if(user == null){
                userNotFound(res);
            } else {
                let pwd = sha512(req.params.password, user.salt);
                if(pwd === user.password) {
                    var dataToUpdate;
                    if(data.newEmail && data.newPassword) {
                        let newPassword = hashPassword(data.newPassword);
                        dataToUpdate = { 
                            email: data.newEmail, 
                            password: newPassword.pwd,
                            salt: newPassword.salt
                        };
                    } else if(data.newEmail) {
                        dataToUpdate = { email: data.newEmail };
                    } else if(data.newPassword) {
                        let newPassword = hashPassword(data.newPassword);
                        dataToUpdate = { 
                            password: newPassword.pwd,
                            salt: newPassword.salt
                        };
                    }
                    if(dataToUpdate) {
                        updateUserDataFromEmail(user.email, dataToUpdate, res);
                    } else {
                        badRequest(res);
                    }
                } else {
                    userNotFound(res);
                }
            }
        });
    }
};

exports.getUserNotifications = (req, res) => {
    getUserById(req.params.uuid, function(err, user){
        if(err){
            internalError(res, err);
        } else if(user == null){
            userNotFound(res);
        } else {
            let limit = req.params.fromIndex + NUM_NOTIFICATIONS_TO_SHOW;
            let notificationsToShow = user.notifications.slice(req.params.fromIndex, limit);
            resultWithJSON(res, {
                notifications: notificationsToShow
            });
        }
    });
};

exports.getUserEvents = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if (err)
            internalError(res, err);
        else if (!user)
            userNotFound(res);
        else {
            var eventsToBeRequested = user.eventsSubscribed.concat(user.eventsFollowed);
            request('https://localhost/events?uuids=' + JSON.stringify(eventsToBeRequested),
                { json: true },(err, res, body) => {
                if (!err && res && body) {
                    let eventsRequested = JSON.parse(body);
                    var eventsSubscribed = [];
                    var eventsFollowed = [];
                    eventsRequested.forEach((e,index) => {
                        if (user.eventsSubscribed.contains(e._id)) {
                            eventsSubscribed.push(e);
                        } else if (user.eventsFollowed.contains(e._id)) {
                            eventsFollowed.push(e);
                        }
                    });
                    resultWithJSON(res, {
                        eventsSubscribed: eventsSubscribed,
                        eventsFollowed: eventsFollowed
                    });
                }
            });
        }
    });
};

exports.addEventToUser = (req, res) => {
    updateUserEvents(req, res,{$push: retrieveEventsToUpdate(req.body)});
};

exports.removeEventToUser = (req, res) => {
    updateUserEvents(req, res,{$pull: retrieveEventsToUpdate(req.body)});
};