let mongoose = require('mongoose');
let request = require('request');
let commons = require('./commons');
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

exports.getUserEvents = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if (err)
            internalError(res, err);
        else if (!user)
            userNotFound(res);
        else {
            var eventsToBeRequested = user.eventsSubscribed.concat(user.eventsFollowed);
            request.get('https://localhost/events?uuids=' + JSON.stringify(eventsToBeRequested), { json: true },
                (err, eventRes, body) => {
                if (err || !body)
                    notContentRetrieved(res);
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

exports.getWrittenReviews = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if (err)
            internalError(res, err);
        else if (!user)
            userNotFound(res);
        else {
            Reviews.find({_id: {$in: user.reviewsDone}}, (err, reviews) => {
                if (err)
                    notContentRetrieved(res);
                else
                    resultWithJSON(res, { reviews: reviews});
            });
        }
    });
};

exports.createNewReview = (req, res) => {
    let newReview = req.body;
    if(!isNewReviewWellFormed(newReview))
        badRequest(res);
    else {
        let dbReview = new Users(newReview);
        dbReview.save((err, review) => {
            if (err)
                internalError(res);
            else {
                Users.findByIdAndUpdate(req.params.uuid, {$push: {reviewsDone: [review._id]}}, (err, model) => {
                    if (err)
                        internalError(res, err);
                    else if (!model)
                        userNotFound(res);
                    else
                        itemCreated(res, review);
                });
            }
        });
    }
};

exports.deleteReview = (req, res) => {
    Users.findByIdAndUpdate(req.params.uuid, {$push: {reviewsDone: [req.body.review]}}, (err, model) => {
        if (err)
            internalError(res, err);
        else if (!model)
            userNotFound(res);
        else {
            Reviews.findByIdAndRemove(req.body.review, (err, reviewRemoved) => {
                if (err)
                    internalError(res, err);
                else
                    resultWithJSON(res, reviewRemoved);
            });
        }
    });
};

exports.getReceivedReviews = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if (err)
            internalError(res, err);
        else if (!user)
            userNotFound(res);
        else {
            Reviews.find({_id: {$in: user.reviewsReceived}}, (err, reviews) => {
                if (err)
                    notContentRetrieved(res);
                else
                    resultWithJSON(res, { reviews: reviews});
            });
        }
    });
};

exports.getUserActions = (req, res) => {
    getUserById(req.params.uuid, (err, user) => {
        if (err)
            internalError(res, err);
        else if (!user)
            userNotFound(res);
        else {
            Actions.find({_id: {$in: user.actions.map(x => x.action)}}, (err, actions) => {
                if (err)
                    notContentRetrieved(res);
                else
                    resultWithJSON(res, { actions: actions});
            });
        }
    });
};

exports.addUserAction = (req, res) => {
    let newAction = req.body;
    if(!isNewActionWellFormed(newAction)) {
        badRequest(res);
    } else {
        let dbAction = new Users(newAction);
        dbAction.save(function(err, action) {
            if (err) {
                internalError(res, err);
            } else {
                itemCreated(res, action);
            }
        });
    }
};