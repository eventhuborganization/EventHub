let mongoose = require('mongoose');
let network = require('./network');

let Users = mongoose.model('Users');

exports.updateUserEvents = (req, res, updates) => {
    if (checkIfEventsUpdateIsABadRequest(req.body))
        badRequest(res);
    Users.findByIdAndUpdate(req.params.uuid, updates,
        (err, model) => {
            if (err)
                network.internalError(res, err);
            else if (!model)
                network.userNotFound(res);
            else
                network.result(res);
        });
};

exports.checkIfEventsUpdateIsABadRequest = (body) => {
    return body.participant || body.follower;
};

exports.retrieveEventsToUpdate = (body) => {
    let eventsSubscribed = [];
    let eventsFollowed = [];
    if (body.participant) {
        eventsSubscribed.push(body.participant);
    }
    if (body.follower) {
        eventsFollowed.push(body.follower);
    }
    return {
        eventsSubscribed: eventsSubscribed,
        eventFollowed: eventsFollowed
    };
};

exports.isNewActionWellFormed = (action) => {
    return action && action.type && action.points;
};

exports.isNewReviewWellFormed = (review) => {
    return review && review.writer && review.event && review.text && review.date && review.evaluation;
};

exports.isNewNotificationWellFormed = (notification) => {
    return typeof notification.tipology === "number" 
        && notification.sender instanceof Schema.Types.ObjectId 
        && notification.timestamp instanceof Date 
        && typeof notification.read === "boolean";
};

/**
 * Know if a user is well formed
 * @param {Object} user the new user data
 */
exports.isNewUserWellFormed = (user) => {
    return user 
        && user.name 
        && user.organization 
        && user.email
        && user.password;
};

/**
 * Know if a update user data is well formed
 * @param {Object} user the update data
 */
exports.isUpdateUserDataWellFormed = (user) => {
    return user
        && (user.name
        || user.surname
        || user.phoneNumber
        || user.address
        || user.profilePicture);
};

/**
 * Know id a login data is well formed
 * @param {Object} data the login data
 */
exports.isLoginDataWellFormed = (data) => {
    return data && data.email && data.password;
};

/**
 * Update user data
 * @param {String} email the user's email 
 * @param {Object} updateValues the values to update 
 * @param {*} res where to send any message
 */
exports.updateUserDataFromEmail = (email, updateValues, res) => {
    Users.findOneAndUpdate(
        { email: email },
        updateValues,
        (err) => {
            if(err){
                network.internalError(res, err);
            } else {
                network.result(res);
            }
        }
    );
};

/**
 * Get the difference array1 - array2
 * @param {Array} array1 the first array
 * @param {Array} array2 the second array
 */
exports.arrayDiff = (array1, array2) => {
    return array1.filter((elem) => array2.indexOf(elem) < 0);
}

exports.isBadgeEarned = (badge, map) => {
    let successfullRequirements = badge.requirements.filter(req => map.get(req.action) >= req.quantity);
    return successfullRequirements.length === badge.requirements.length;
}