let mongoose = require('mongoose');
let request = require('request');
let commons = require('./commons');
let security = require('./security');
let network = require('./network');

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
    if(!commons.isNewUserWellFormed(newUser)) {
        network.badRequest(res);
    } else {
        let password = security.hashPassword(newUser.password);
        newUser.salt = password.salt;
        newUser.password = password.pwd;
        let dbUser = new Users(newUser);
        dbUser.save(function(err, user) {
            if (err) {
                network.internalError(res, err);
            } else {
                network.userCreated(res, user);
            }
        });
    }
};

exports.deleteUser = (req, res) => {
    Users.findByIdAndDelete(req.params.uuid, function(err, user) {
        if(err) {
            network.internalError(res, err);
        } else {
            network.result(res);
        }
    });
};

exports.userLogin = (req, res) => {
    let data = req.body;
    if(!commons.isLoginDataWellFormed(data)) {
        network.userNotFound(res);
    } else {
        Users.findOne({ email: data.email }, function(err, user){
            if(err){
                network.internalError(res, err);
            } else if(user == null){
                network.userNotFound(res);
            } else {
                let pwd = security.sha512(req.params.password, user.salt);
                if(pwd === user.password) {
                    network.result(res);
                } else {
                    network.userNotFound(res);
                }
            }
        });
    }
};

exports.getUserInformations = (req, res) => {
    getUserById(req.params.uuid, function(err, user){
        if(err){
            network.internalError(res);
        } else if(user == null){
            network.userNotFound(res);
        } else {
            network.resultWithJSON(res, user);
        }
    });
};

exports.updateUserInformations = (req, res) => {
    let data = req.body;
    if(commons.isUpdateUserDataWellFormed(data)){
        Users.findByIdAndUpdate(req.params.uuid, data, function(err, user){
            if(err){
                network.internalError(res);
            } else {
                network.result(res);
            }
        });
    } else {
        network.badRequest(res);
    }
};

exports.updateUserCredentials = (req, res) => {
    let data = req.body;
    if(!commons.isLoginDataWellFormed(data)) {
        network.badRequest(res);
    } else {
        Users.findOne({ email: data.email }, function(err, user){
            if(err){
                network.internalError(res, err);
            } else if(user == null){
                network.userNotFound(res);
            } else {
                let pwd = security.sha512(req.params.password, user.salt);
                if(pwd === user.password) {
                    var dataToUpdate;
                    if(data.newEmail && data.newPassword) {
                        let newPassword = security.hashPassword(data.newPassword);
                        dataToUpdate = { 
                            email: data.newEmail, 
                            password: newPassword.pwd,
                            salt: newPassword.salt
                        };
                    } else if(data.newEmail) {
                        dataToUpdate = { email: data.newEmail };
                    } else if(data.newPassword) {
                        let newPassword = security.hashPassword(data.newPassword);
                        dataToUpdate = { 
                            password: newPassword.pwd,
                            salt: newPassword.salt
                        };
                    }
                    if(dataToUpdate) {
                        commons.updateUserDataFromEmail(user.email, dataToUpdate, res);
                    } else {
                        network.badRequest(res);
                    }
                } else {
                    network.userNotFound(res);
                }
            }
        });
    }
};

exports.getUserNotifications = (req, res) => {
    getUserById(req.params.uuid, function(err, user){
        if(err){
            network.internalError(res, err);
        } else if(user == null){
            network.userNotFound(res);
        } else {
            let limit = req.params.fromIndex + NUM_NOTIFICATIONS_TO_SHOW;
            let notificationsToShow = user.notifications.slice(req.params.fromIndex, limit);
            network.resultWithJSON(res, {
                notifications: notificationsToShow
            });
        }
    });
};

exports.addUserNotification = (req, res) => {
    if (req.body.tipology instanceof Number && req.body.sender instanceof Schema.Types.ObjectId && timestamp instanceof Date && read instanceof Boolean) {
        Users.findById(req.params.uuid, {$push: {notifications: req.body}}, (err, user) => {
            if (err) {
                network.userNotFound(res);
            }
            network.result(res);
        });
    }
    
};

exports.addLinkedUser = (req, res) => {
    Users.findById(req.body.uuid1, (err, user1) => {
        if (err) {
            network.userNotFound(res);
        }
        Users.findById(req.body.uuid2, (err, user2) => {
            if(err) {
                network.userNotFound(res);
            }
            user1.linkedUsers.push(req.body.uuid2);
            user2.linkedUsers.push(req.body.uuid1);
            network.result(res);
        });
    });
};

exports.removeLinkedUser = (req, res) => {
    Users.findById(req.body.uuid1, (err, user1) => {
        if (err) {
            network.userNotFound(res);
        }
        Users.findById(req.body.uuid2, (err, user2) => {
            if(err) {
                network.userNotFound(res);
            }
            let index1 = user1.linkedUsers.indexOf(req.body.uuid2);
            let index2 = user2.linkedUsers.indexOf(req.body.uuid1);
            if (index1>-1 && index2>-1) {
                user1.linkedUsers.splice(index1,1);
                user2.linkedUsers.splice(index2,1);
                network.result(res);
            } else {
                network.notFound(res,{description: 'Link between users not found.'})
            }
        });
    });
};

exports.getLinkedUser = (req,res) => {
    if(req.params.uuid){
        Users.findById(req.params.uuid, (err, user) => {
            if(err){
                network.userNotFound(res);
            }
            network.resultWithJSON(res, {linked: user.linkedUsers});
        })
    }
};

exports.getBadgePoints = (req, res) => {
    if(req.params.uuid){
        Users.findById(req.params.uuid, (err, user) => {
            if(err){
                network.userNotFound(res);
            }
            network.resultWithJSON(res, {badge: user.badges, points: user.points});
        })
    }
};

exports.getUserEvents = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if (err)
            network.internalError(res, err);
        else if (!user)
            network.userNotFound(res);
        else {
            var eventsToBeRequested = user.eventsSubscribed.concat(user.eventsFollowed);
            request.get('https://localhost/events?uuids=' + JSON.stringify(eventsToBeRequested), { json: true },
                (err, eventRes, body) => {
                if (err || !body)
                    network.notContentRetrieved(res);
                else {
                    var eventsSubscribed = [];
                    var eventsFollowed = [];
                    //body dovrebbe già essere un array, speriamooooo ahahah
                    body.forEach((e,index) => {
                        if (user.eventsSubscribed.contains(e._id)) {
                            eventsSubscribed.push(e);
                        } else if (user.eventsFollowed.contains(e._id)) {
                            eventsFollowed.push(e);
                        }
                    });
                    network.resultWithJSON(res, {
                        eventsSubscribed: eventsSubscribed,
                        eventsFollowed: eventsFollowed
                    });
                }
            });
        }
    });
};

exports.addEventToUser = (req, res) => {
    commons.updateUserEvents(req, res,{$push: retrieveEventsToUpdate(req.body)});
};

exports.removeEventToUser = (req, res) => {
    commons.updateUserEvents(req, res,{$pull: retrieveEventsToUpdate(req.body)});
};

exports.getWrittenReviews = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if (err)
            network.internalError(res, err);
        else if (!user)
            network.userNotFound(res);
        else {
            Reviews.find({_id: {$in: user.reviewsDone}}, (err, reviews) => {
                if (err)
                    network.notContentRetrieved(res);
                else
                    network.resultWithJSON(res, { reviews: reviews});
            });
        }
    });
};

exports.createNewReview = (req, res) => {
    let newReview = req.body;
    if(!commons.isNewReviewWellFormed(newReview))
        network.badRequest(res);
    else {
        let dbReview = new Users(newReview);
        dbReview.save((err, review) => {
            if (err)
                network.internalError(res);
            else {
                Users.findByIdAndUpdate(req.params.uuid, {$push: {reviewsDone: [review._id]}}, (err, model) => {
                    if (err)
                        network.internalError(res, err);
                    else if (!model)
                        network.userNotFound(res);
                    else
                        network.itemCreated(res, review);
                });
            }
        });
    }
};

exports.deleteReview = (req, res) => {
    Users.findByIdAndUpdate(req.params.uuid, {$push: {reviewsDone: [req.body.review]}}, (err, model) => {
        if (err)
            network.internalError(res, err);
        else if (!model)
            network.userNotFound(res);
        else {
            Reviews.findByIdAndRemove(req.body.review, (err, reviewRemoved) => {
                if (err)
                    network.internalError(res, err);
                else
                    network.resultWithJSON(res, reviewRemoved);
            });
        }
    });
};

exports.getReceivedReviews = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if (err)
            network.internalError(res, err);
        else if (!user)
            network.userNotFound(res);
        else {
            Reviews.find({_id: {$in: user.reviewsReceived}}, (err, reviews) => {
                if (err)
                    network.notContentRetrieved(res);
                else
                    network.resultWithJSON(res, { reviews: reviews});
            });
        }
    });
};

exports.getUserActions = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if (err)
            network.internalError(res, err);
        else if (!user)
            network.userNotFound(res);
        else {
            Actions.find({_id: {$in: user.actions.map(x => x.action)}}, (err, actions) => {
                if (err)
                    network.notContentRetrieved(res);
                else
                    network.resultWithJSON(res, { actions: actions});
            });
        }
    });
};

exports.addUserAction = (req, res) => {
    let newAction = req.body;
    if(!commons.isNewActionWellFormed(newAction)) {
        network.badRequest(res);
    } else {
        let dbAction = new Users(newAction);
        dbAction.save(function(err, action) {
            if (err) {
                network.internalError(res, err);
            } else {
                network.itemCreated(res, action);
            }
        });
    }
};