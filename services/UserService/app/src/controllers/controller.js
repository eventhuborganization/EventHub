let mongoose = require('mongoose')
let Fuse = require('fuse.js')
let commons = require('./commons')
let security = require('./security')
let network = require('./network')

let Users = mongoose.model('Users')
let Reviews = mongoose.model('Reviews')
let Groups = mongoose.model('Groups')
let Actions = mongoose.model("Actions")
let Badges = mongoose.model("Badges")

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
        Users.findOne({email: newUser.email}, (err, user) => {
            if(err){
                network.internalError(res, err);
            } else if (user == null){
                let password = security.hashPassword(newUser.password);
                newUser.salt = password.salt;
                newUser.password = password.pwd;
                let dbUser = new Users(newUser);
                dbUser.save(function(err, user) {
                    if (err) {
                        network.internalError(res, err);
                    } else {
                        if(user.profilePicture){
                            user.profilePicture = user._id + Date.now() + user.profilePicture
                            user.save((err, finalUser) => {
                                if (err) {
                                    Users.findByIdAndDelete(user._id, () => {
                                        network.internalError()
                                    })
                                }
                                let user_data = commons.deleteUserPrivateInformations(finalUser);
                                network.userCreated(res, user_data);
                            })
                        } else {
                            network.userCreated(res, user);
                        }
                    }
                });
            } else {
                network.badRequestJSON(res, {description: "This email is already registered to another user."});
            }
        });
    }
};

exports.deleteUser = (req, res) => {
    Users.findByIdAndDelete(req.params.uuid, (err) => {
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
        Users.findOne({ email: data.email }, (err, user) => {
            if(err){
                network.internalError(res, err);
            } else if(user == null){
                network.userNotFound(res);
            } else {
                let pwd = security.sha512(data.password, user.salt);
                if(pwd === user.password) {
                    let user_data = commons.deleteUserPrivateInformations(user)
                    network.resultWithJSON(res, user_data)
                } else {
                    network.userNotFound(res);
                }
            }
        });
    }
};

exports.getUserInformations = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if(err){
            network.internalError(res);
        } else if(user == null){
            network.userNotFound(res);
        } else {
            let user_data = commons.deleteUserPrivateInformations(user);
            network.resultWithJSON(res, user_data);
        }
    });
};

exports.updateUserInformations = (req, res) => {
    let data = req.body;
    if(commons.isUpdateUserDataWellFormed(data)){
        Users.findByIdAndUpdate(req.params.uuid, {$set: data}, { new: true }, (err, newUser) => {
            if(err){
                network.internalError(res);
            } else {
                network.resultWithJSON(res, newUser);
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
        Users.findOne({ email: data.email }, (err, user) => {
            if(err){
                network.internalError(res, err);
            } else if(user == null){
                network.userNotFound(res);
            } else {
                let pwd = security.sha512(data.password, user.salt);
                if(pwd === user.password) {
                    var dataToUpdate = {};
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
                    if(Object.keys(dataToUpdate).length > 0) {
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
    getUserById(req.params.uuid, (err, user) => {
        if(err){
            network.internalError(res, err);
        } else if(user == null){
            network.userNotFound(res);
        } else {            
            let limit = req.params.fromIndex + NUM_NOTIFICATIONS_TO_SHOW;
            let notificationsToShow = user.notifications.filter(not => !not.read).slice(req.params.fromIndex, limit);
            network.resultWithJSON(res, {
                notifications: notificationsToShow
            });
        }
    });
};

exports.addUserNotification = (req, res) => {
    if (commons.isNewNotificationWellFormed(req.body)) {
        let data = {};
        data.read = false;
        data.timestamp = Date.now();
        data.typology = req.body.typology;
        data.sender = req.body.sender;
        data.data = req.body.data;
        switch (data.typology) {
            case 0: // Invito ad un evento
                Users.findById(req.params.uuid, (err, user) => {
                    if (err) {
                        network.userNotFound(res);
                    } else {
                        if (user.notifications.filter(e => e.typology === 0 &&
                            e.sender.toString() === data.sender &&
                            e.read === false).length === 0 ) {
                            user.notifications.push(data)
                            user.save(() => network.result(res))
                        } else {
                            network.result(res)
                        }
                    }
                });
                break
            case 1: // Invito richiesta di amicizia
                Users.findById(req.params.uuid, (err, user) => {
                    if (err) {
                        network.userNotFound(res);
                    } else {
                        if (user.notifications.filter(e => e.typology === 1 &&
                            e.sender.toString() === data.sender &&
                            e.read === false).length <= 0 ) {
                            user.notifications.push(data)
                            user.save(() => network.result(res))
                        } else {
                            network.result(res)
                        }
                    }
                });
                break
            case 4: //Richiesta di posizione
            Users.findById(req.params.uuid, (err, user) => {
                if (err) {
                    network.userNotFound(res);
                } else {
                    let notification = user.notifications.findIndex(e => { 
                        return  e.typology === 4 && e.sender === data.sender && e.read === false
                    })

                    if (notification >= 0 ) {
                        user.notifications[notification].read = true
                    }
                    user.notifications.push(data)
                    user.save(() => network.result(res))
                }
            });
                break
            default:
                Users.findByIdAndUpdate(req.params.uuid, {$push: {notifications: data}}, (err) => {
                    if (err) {
                        network.userNotFound(res);
                    } else {
                        network.result(res);
                    }
                });
                break;
        }
    } else {
        network.badRequest(res);
    }
};

exports.notificationRead = (req, res) => {
    Users.findById(req.params.userUuid, (err, user) => {
        if (err) {
            network.userNotFound(res);
        } else if(user.notifications.length > 0){
            let index = user.notifications.findIndex(not => not._id.toString() === req.params.notUuid);
            if(index >= 0){
                user.notifications[index].read = true;
                user.updateOne(user, (err) => {
                    if(err){
                        network.internalError(res, err);
                    } else {
                        network.result(res);
                    }
                });
            } else {
                network.notFound(res, {description: "Notification not found"});
            }
        } else {
            network.notFound(res, {description: "Notification not found"});
        }
    });
};

exports.addLinkedUser = (req, res) => {
    if(commons.isLinkWellFormed(req.body)) {
        Users.findById(req.body.uuid1, (err, user1) => {
            if (err) {
                network.userNotFound(res);
            } else if (user1.linkedUsers.includes(req.body.uuid2)){
                network.badRequestJSON(res, {description: "The users are already linked"});
            } else {
                Users.findById(req.body.uuid2, (err, user2) => {
                    if(err) {
                        network.userNotFound(res);
                    }
                    user1.linkedUsers.push(req.body.uuid2);
                    user2.linkedUsers.push(req.body.uuid1);
                    user1.save();
                    user2.save();
                    network.result(res);
                });
            }
        });
    } else {
        network.badRequest(res);
    }
};

exports.removeLinkedUser = (req, res) => {
    if(commons.isLinkWellFormed(req.body)) {
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
                    user1.save();
                    user2.save();
                    network.result(res);
                } else {
                    network.notFound(res,{description: 'Link between users not found.'})
                }
            });
        });
    } else {
        network.badRequest(res);
    }
};

exports.getLinkedUser = (req,res) => {
    Users.findById(req.params.uuid, (err, user) => {
        if(err){
            network.userNotFound(res);
        }
        network.resultWithJSON(res, {linkedUsers: user.linkedUsers});
    })
};

exports.getBadgePoints = (req, res) => {
    Users.findById(req.params.uuid, (err, user) => {
        if(err){
            network.userNotFound(res);
        }
        let badges = [];
        user.badges.forEach(function(badgeId) {
            Badges.findById(badgeId, (err, badge) => {
                if (err) {
                    network.notFound(res, {description: "badge not found"})
                }
                badge.id = badgeId;
                badges.push(badge);
            })
        })
        user.badges = badges;
        network.resultWithJSON(res, {badge: user.badges, points: user.points});
    })
};

exports.getUserEvents = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if (err)
            network.internalError(res, err);
        else if (!user)
            network.userNotFound(res);
        else {
            network.resultWithJSON(res, {
                eventsSubscribed: user.eventsSubscribed,
                eventsFollowed: user.eventsFollowed
            });
        }
    });
};

exports.addEventToUser = (req, res) => {
    commons.updateUserEvents(req, res,{$addToSet: commons.retrieveEventsToUpdate(req.body)})
};

exports.removeEventToUser = (req, res) => {
    commons.updateUserEvents(req, res,{$pullAll: commons.retrieveEventsToUpdate(req.body)})
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
                    network.resultWithJSON(res, { writer: {_id: user._id, name: user.name, surname: user.surname, avatar: user.profilePicture}, reviews: reviews});
            });
        }
    });
};

exports.createNewReview = (req, res) => {
    let newReview = req.body;    
    if(!commons.isNewReviewWellFormed(newReview))
        network.badRequest(res);
    else {
        Reviews.findOne({writer: newReview.writer, event: newReview.event}, (err,review) => {
            if (err)
                network.internalError(res);
            else if (!review){
                let dbReview = new Reviews(newReview);
                dbReview.save((err, review) => {
                    if (err)
                        network.internalError(res);
                    else {
                        Users.findByIdAndUpdate(req.params.uuid, {$push: {reviewsDone: [review._id]}}, (err, model) => {
                            if (err)
                                network.internalError(res, err);
                            else if (!model) {
                                network.userNotFound(res);
                            } else {
                                Users.findByIdAndUpdate(newReview.eventOrganizator, {$push: {reviewsReceived: [review._id]}}, (err, result) => {
                                    if (err)
                                        network.internalError(res, err);
                                    else if (!result) {
                                        network.userNotFound(res);
                                    } else
                                        network.itemCreated(res, review);
                                });
                            }  
                        });
                    }
                });
            } else 
                network.badRequest(res)
        })
        
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
                else {
                    network.resultWithJSON(res, reviews);
                }
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
    console.log(newAction);
    if(!commons.isNewActionWellFormed(newAction)) {
        network.badRequest(res);
    } else {
        Users.findById(req.params.uuid, (err, user) => {
            if (err)
                network.internalError(res, err);
            else if (!user)
                network.userNotFound(res);
            else {
                console.log("utente trovato");
                Actions.findOne({typology: newAction.typology}, (err, action) => {
                    if(err){
                        network.internalError(res, err);
                    } else if(!action){
                        console.log("azione non trovata");
                        network.notFound(res, {description: "Action not found"});
                    } else {
                        user.actions.push({
                            action: action._id,
                            date: new Date()
                        });
                        console.log(user.points + " + " + action.points);
                        user.points += action.points;
                        console.log(user.points);
                        Badges.find({}, function(err, badges) {
                            if(err) {
                                console.log(err);
                                network.internalError(res, err);
                            } else {
                                if (badges) {
                                    console.log("Entrato Badge");
                                    //removing already acquired badges
                                    let badgesDiff = badges.filter(elem => user.badges.indexOf(elem._id) < 0);

                                    // count all user's actions
                                    let map = new Map();
                                    user.actions.forEach(element => {
                                        var value = map.get(element.action);
                                        if(!value)
                                            value = 0;
                                        value++;
                                        map.set(element.action, value);
                                    });

                                    // check if there is a new badge earned
                                    badgesDiff.forEach(badge => {
                                        if(commons.isBadgeEarned(badge, map)){
                                            user.badges.push(badge._id);
                                        }
                                    });
                                }
                                user.save((err,result) => {
                                    if(err){
                                        console.log("Errore "+err);
                                        network.internalError(res, err);
                                    } else {
                                        console.log("Finito");
                                        network.result(res);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};

exports.getUserGroups = (req, res) => {
    Users.findById(req.params.uuid, (err, user) => {
        if(err){
            network.userNotFound(res);
        }
        network.resultWithJSON(res, user.groups);
    })
};

exports.addUserInGroup = (req, res) => {
    if (req.body && typeof(req.body.group) === "string") {
        Groups.findByIdAndUpdate(
            req.body.group, 
            {$addToSet: {members: req.params.uuid}},
            err2 => {
                if(err2) {
                    network.groupNotFound(res)
                } else {
                    Users.findByIdAndUpdate(
                        req.params.uuid,
                        {$addToSet: {groups: req.body.group}},
                        err3 => {
                            if(err3){
                                network.userNotFound(res)
                            } else {
                                network.result(res)
                            }
                        }
                    )
                }
            }
        )
    } else {
        network.badRequest(res)
    }
};

exports.removeUserFromGroup = (req, res) => {
    if (req.body && typeof(req.body.group) === "string") {
        Users.findById(req.params.uuid, (err, user) => {
            if (err) {
                network.userNotFound(res)
            } else {
                Groups.findById(req.body.group, (err2, group) => {
                    if(err2) {
                        network.groupNotFound(res)
                    } else {
                        user.groups = user.groups.filter(id => id.toString() !== req.body.group)
                        if(group.members.length > 1){
                            group.members = group.members.filter(id => id.toString() !== req.params.uuid)
                            user.save()
                            group.save()
                            network.result(res)
                        } else {
                            Groups.findByIdAndDelete(req.body.group, err3 => {
                                if(err3){
                                    network.internalError(res, err3)
                                } else {
                                    user.save()
                                    network.result(res)
                                }
                            })
                        }
                    }
                })
            }
        })
    } else {
        network.badRequest(res)
    }
};

exports.createGroup = (req, res) => {
    if(req.body && req.body.users instanceof Array && typeof req.body.name === "string") {
        let newGroup = {};
        newGroup.name = req.body.name;
        newGroup.members = req.body.users;
        let dbGroup = new Groups(newGroup);
        Users.find({_id: { "$in" : req.body.users}}, (err, users) => {
            if(err){
                network.internalError(res, err);
            } else {
                dbGroup.save((err2, group) => {
                    if (err2) {
                        network.internalError(res, err2);
                    } else {
                        users.forEach(user => {
                            user.groups.push(group._id)
                            user.save()
                        })
                        network.itemCreated(res, group);
                    }
                })
            }
        })
    } else {
        network.badRequest(res);
    }
};

exports.getGroup = (req, res) => {
    Groups.findById(req.params.uuid, (err, group) => {
        if(err){
            network.userNotFound(res);
        }
        network.resultWithJSON(res, group);
    })
};

exports.searchUser = (req, res) => {
    let optionsFuse = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: [
          "name",
          "surname"
        ]
    };
    Users.find({}, (err, users) => {
        if (err)
            network.notContentRetrieved(res);
        else{
            let fuse = new Fuse(users, optionsFuse)
            let list = fuse.search(req.params.name)
            let result = []
            list.map(user => commons.deleteUserPrivateInformations(user))
                .forEach(user => result.push(user))
            network.resultWithJSON(res,result)
        }
    });
}


exports.getEventReviews = (req, res) => {
    Reviews.find({event: req.params.uuid}, (err, reviews) => {
        if (err)
            network.notContentRetrieved(res)
        else {
            network.resultWithJSON(res,reviews)
        }
    }) 
}