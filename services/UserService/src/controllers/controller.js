let mongoose = require('mongoose');
let request = require('request');
let commons = require('commons');
let crypto = require('crypto');

let Users = mongoose.model('Users');
let Reviews = mongoose.model('Reviews');
let Groups = mongoose.model('Groups');
let Actions = mongoose.model("Actions");
let Badges = mongoose.model("Badges");

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
    newUser.salt = genRandomString(16);
    newUser.password = sha512(newUser.password, newUser.salt);
    let dbUser = new Users(newUser);
    dbUser.save(function(err, user) {
		if (err) {
            res.status(400).send(err);
        }
		res.status(201).json(user);
	});
};

exports.deleteUser = (req, res) => {
    Users.deleteOne({ _id: req.params.uuid }, (err) => {
        if(err) {
            res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
};

exports.userLogin = (req, res) => {
    let data = req.body;
    Users.findOne({ email: data.email }, function(err, user){
        if(err){
            res.status(404).end();
        }
        let pwd = sha512(req.params.password, user.salt);
        if(pwd === user.password) {
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    });
};

exports.getUserInformations = (req, res) => {
};

exports.updateUserInformations = (req, res) => {
};

exports.updateUserCredentials = (req, res) => {
};

exports.getUserNotifications = (req, res) => {
};

exports.addUserNotification = (req, res) => {
    if (req.body.tipology instanceof Number && req.body.sender instanceof Schema.Types.ObjectId && timestamp instanceof Date && read instanceof Boolean) {
        Users.findById(req.params.uuid, {$push: {notifications: req.body}}, (err, user) => {
            if (err) {
                userNotFound(res);
            }
            result(res);
        });
    }
    
};

exports.addLinkedUser = (req, res) => {
    Users.findById(req.body.uuid1, (err, user1) => {
        if (err) {
            userNotFound(res);
        }
        Users.findById(req.body.uuid2, (err, user2) => {
            if(err) {
                userNotFound(res);
            }
            user1.linkedUsers.push(req.body.uuid2);
            user2.linkedUsers.push(req.body.uuid1);
            result(res);
        });
    });
};

exports.removeLinkedUser = (req, res) => {
    Users.findById(req.body.uuid1, (err, user1) => {
        if (err) {
            userNotFound(res);
        }
        Users.findById(req.body.uuid2, (err, user2) => {
            if(err) {
                userNotFound(res);
            }
            let index1 = user1.linkedUsers.indexOf(req.body.uuid2);
            let index2 = user2.linkedUsers.indexOf(req.body.uuid1);
            if (index1>-1 && index2>-1) {
                user1.linkedUsers.splice(index1,1);
                user2.linkedUsers.splice(index2,1);
                result(res);
            } else {
                notFound(res,{description: 'Link between users not found.'})
            }
        });
    });
};

exports.getLinkedUser = (req,res) => {
    if(req.params.uuid){
        Users.findById(req.params.uuid, (err, user) => {
            if(err){
                userNotFound(res);
            }
            resultWithJSON(res, {linked: user.linkedUsers});
        })
    }
};

exports.getBadgePoints = (req, res) => {
    if(req.params.uuid){
        Users.findById(req.params.uuid, (err, user) => {
            if(err){
                userNotFound(res);
            }
            resultWithJSON(res, {badge: user.badges, points: user.points});
        })
    }
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