let mongoose = require('mongoose');
let network = require('./network');

let Users = mongoose.model('Users');

exports.deleteUserPrivateInformations = (user) => {
    let modifiableUser = Object.assign({}, user._doc)
    delete modifiableUser.password
    delete modifiableUser.salt
    return modifiableUser
}

exports.updateUserEvents = (req, res, updates) => {
    if (exports.isEventUpdateWellFormed(req.body)){  
        Users.findByIdAndUpdate(req.params.uuid, updates,
            (err, model) => {
                if (err) 
                    network.internalError(res, err);
                else if (!model)
                    network.userNotFound(res)
                else
                    network.result(res)
            })
    } else {   
        network.badRequest(res)
    }
}

exports.isEventUpdateWellFormed = (body) => {
    return body.participant || body.follower || body.organizator
}

exports.retrieveEventsToUpdate = (body) => {
    let eventsSubscribed = []
    let eventsFollowed = []
    let eventsOrganized = []
    if (body.participant)
        eventsSubscribed.push(body.participant)
    if (body.follower)
        eventsFollowed.push(body.follower)
    if (body.organizator)
        eventsOrganized.push(body.organizator)
    return {
        eventsSubscribed: eventsSubscribed,
        eventsFollowed: eventsFollowed,
        eventsOrganized: eventsOrganized
    };
};

exports.isNewActionWellFormed = (action) => {
    return action != null 
        && typeof(action.typology) == "number";
};

exports.isNewReviewWellFormed = (review) => {
    return review != null 
        && typeof(review.writer) == "string"  
        && typeof(review.event) == "string" 
        && typeof(review.text) == "string"  
        && typeof(review.date) == "number"
        && typeof(review.evaluation) == "number";
};

exports.isNewNotificationWellFormed = (notification) => {
    return typeof notification.typology === "number" 
        && typeof notification.sender === "string";
};

exports.isLinkWellFormed = (link) => {
    return link != null 
        && typeof(link.uuid1) == "string"  
        && typeof(link.uuid2) == "string";
}

/**
 * Know if a user is well formed
 * @param {Object} user the new user data
 */
exports.isNewUserWellFormed = (user) => {
    return user != null
        && typeof(user.name) == "string" 
        && typeof(user.organization) == "boolean" 
        && typeof(user.email) == "string"
        && typeof(user.password) == "string";
};

/**
 * Know if a update user data is well formed
 * @param {Object} user the update data
 */
exports.isUpdateUserDataWellFormed = (user) => {
    return user != null
        && (typeof(user.name) == "string"
        || typeof(user.surname) == "string"
        || typeof(user.phoneNumber) == "string"
        || user.address instanceof Object
        || typeof(user.profilePicture) == "string");
};

/**
 * Know id a login data is well formed
 * @param {Object} data the login data
 */
exports.isLoginDataWellFormed = (data) => {
    return data != null
        && typeof(data.email) == "string"
        && typeof(data.password) == "string";
};

/**
 * Update user data
 * @param {String} email the user's email 
 * @param {Object} updateValues the values to update 
 * @param {*} res where to send any message
 */
exports.updateUserDataFromEmail = (email, updateValues, res) => {
    var updateFunction = () => Users.findOneAndUpdate(
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

    if(updateValues.email){
        Users.findOne({email: updateValues.email}, (err, user) => {
            if(err || user == null){
                updateFunction();
            } else {
                network.badRequestJSON(res, {description: "This email is already registered to another user."});
            }
        });
    } else {
        updateFunction();
    }
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
    let successfullRequirements = badge.requirements.filter(req => map.get(req.action.toString()) >= req.quantity)
    return successfullRequirements.length === badge.requirements.length;
}

exports.getCountedUserActions = (user) => {
    let map = new Map()
    user.actions.forEach(element => {
        var value = map.get(element.action.toString())
        if(!value)
            value = 0
        value++
        map.set(element.action.toString(), value)
    })
    return map
}