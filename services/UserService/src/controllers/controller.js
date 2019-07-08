let mongoose = require('mongoose');
let request = require('request');
let commons = require('commons');
let crypto = require('crypto');

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

/**
 * Generates random string of characters i.e salt
 * @param {number} length length of the random string
 */
function genRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
}

/**
 * Hash password with sha512.
 * @param {String} password list of required fields
 * @param {String} salt data to be validated
 */
function sha512(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
}

exports.createNewUser = (req, res) => {
    let newUser = req.body;
    if( !(newUser.name 
        && newUser.organization 
        && newUser.email
        && newUser.password)) {
        res.status(400).end();
    } else {
        newUser.salt = genRandomString(16);
        newUser.password = sha512(newUser.password, newUser.salt);
        let dbUser = new Users(newUser);
        dbUser.save(function(err, user) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(201).json(user);
            }
        });
    }
};

exports.deleteUser = (req, res) => {
    Users.deleteOne({ _id: req.params.uuid }, (err) => {
        if(err) {
            res.status(500).send({
                description: err
            });
        } else {
            res.status(200).end();
        }
    });
};

exports.userLogin = (req, res) => {
    let data = req.body;
    if( !data.email || !data.password) {
        res.status(400).end();
    } else {
        Users.findOne({ email: data.email }, function(err, user){
            if(err){
                res.status(500).send({
                    description: err
                });
            } else if(user == null){
                res.status(404).end();
            } else {
                let pwd = sha512(req.params.password, user.salt);
                if(pwd === user.password) {
                    res.status(200).end();
                } else {
                    res.status(404).end();
                }
            }
        });
    }
};

exports.getUserInformations = (req, res) => {
    getUserById(req.params.uuid, function(err, user){
        if(err){
            res.status(500).send({
                description: err
            });
        } else if(user == null){
            res.status(404).end();
        } else {
            res.status(200).json(user);
        }
    });
};

exports.updateUserInformations = (req, res) => {
};

exports.updateUserCredentials = (req, res) => {
    let data = req.body;
    if(!data.email || !data.password) {
        res.status(400).end();
    } else {
        Users.findOne({ email: data.email }, function(err, user){
            if(err){
                res.status(500).send({
                    description: err
                });
            } else if(user == null){
                res.status(404).end();
            } else {
                let pwd = sha512(req.params.password, user.salt);
                if(pwd === user.password) {
                    if(data.newEmail && data.newPassword) {
                        let newSalt = genRandomString(16);
                        let newPassword = sha512(newPassword, salt);
                        Users.findOneAndUpdate(
                            { email: data.email },
                            { 
                                email: data.newEmail, 
                                password: newPassword,
                                salt: newSalt
                            },
                            function(err, user){
                                if(err){
                                    res.status(500).send({
                                        description: err
                                    });
                                } else {
                                    res.status(200).end();
                                }
                            }
                        );
                    } else if(data.newEmail) {
                        Users.findOneAndUpdate(
                            { email: data.email },
                            { email: data.newEmail },
                            function(err, user){
                                if(err){
                                    res.status(500).send({
                                        description: err
                                    });
                                } else {
                                    res.status(200).end();
                                }
                            }
                        );
                    } else if(data.newPassword) {
                        let newSalt = genRandomString(16);
                        let newPassword = sha512(newPassword, salt);
                        Users.findOneAndUpdate(
                            { email: data.email },
                            { 
                                password: newPassword,
                                salt: newSalt
                            },
                            function(err, user){
                                if(err){
                                    res.status(500).send({
                                        description: err
                                    });
                                } else {
                                    res.status(200).end();
                                }
                            }
                        );
                    } else {
                        res.send(400).end();
                    }
                } else {
                    res.status(404).end();
                }
            }
        });
    }
};

exports.getUserNotifications = (req, res) => {
    getUserById(req.params.uuid, function(err, user){
        if(err){
            res.status(500).send({
                description: err
            });
        } else if(user == null){
            res.status(404).end();
        } else {
            let limit = req.params.fromIndex + NUM_NOTIFICATIONS_TO_SHOW;
            let notificationsToShow = user.notifications.slice(req.params.fromIndex, limit);
            res.status(200).json({
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