function updateUserEvents(req, res, updates) {
    if (checkIfEventsUpdateIsABadRequest(req.body))
        badRequest(res);
    Users.findByIdAndUpdate(req.params.uuid, updates,
        (err, model) => manageUserUpdateResult(err, model, res));
}

function checkIfEventsUpdateIsABadRequest(body) {
    return body.participant || body.follower;
}

function retrieveEventsToUpdate(body) {
    var eventsSubscribed = [];
    var eventsFollowed = [];
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
}

function manageUserUpdateResult(err, model, res) {
    if (err)
        internalError(res, err);
    else if (!model)
        userNotFound(res);
    else
        result(res);
}

/**
 * Know if a user is well formed
 * @param {Object} user the new user data
 */
function isNewUserWellFormed(user){
    return user 
        && user.name 
        && user.organization 
        && user.email
        && user.password;
}

/**
 * Know if a update user data is well formed
 * @param {Object} user the update data
 */
function isUpdateUserDataWellFormed(user){
    return user
        && (user.name
        || user.surname
        || user.phoneNumber
        || user.address
        || user.profilePicture);
}

/**
 * Know id a login data is well formed
 * @param {Object} data the login data
 */
function isLoginDataWellFormed(data){
    return data && data.email && data.password;
}

/**
 * Update user data
 * @param {String} email the user's email 
 * @param {Object} updateValues the values to update 
 * @param {*} res where to send any message
 */
function updateUserDataFromEmail(email, updateValues, res){
    Users.findOneAndUpdate(
        { email: email },
        updateValues,
        function(err, user){
            if(err){
                internalError(res);
            } else {
                result(res);
            }
        }
    );
}

/* ------------------------------------ */

/**
 * Send an internal error over the network
 * @param {*} res where to send the message
 * @param {*} err the error
 */
function internalError(res, err) {
    res.status(500).send(err);
}

/**
 * Send an ok message over the network
 * @param {*} res where to send the message
 */
function result(res) {
    res.status(200).send({});
}

/**
 * Send an ok message over the network
 * @param {*} res where to send the message
 * @param {Object} data the JSON data to send
 */
function resultWithJSON(res, data) {
    res.status(200).json(data);
}

/**
 * Send a created message over the network
 * @param {*} res where to send the message
 * @param {Object} user the user's data
 */
function userCreated(res, user) {
    res.status(201).send(user);
}

/**
 * Send a bad request message over the network
 * @param {*} res where to send the message
 */
function badRequest(res) {
    res.status(400).send({});
}

/**
 * Send a user not found request message over the network
 * @param {*} res where to send the message
 */
function userNotFound(res) {
    notFound(res,{ description: 'User not found.'});
}

/**
 * Send a not found request message over the network
 * @param {*} res where to send the message
 * @param {*} jsonData the message to sen<d
 */
function notFound(res, jsonData) {
    res.status(404).send(jsonData);
}