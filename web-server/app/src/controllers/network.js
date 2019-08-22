/**
 * Send an internal error over the network
 * @param {Response} res where to send the message
 * @param {*} err the error
 */
exports.internalError = (res, err) => {
    res.status(500).send(err);
};

/**
 * Send an ok message over the network
 * @param {Response} res where to send the message
 */
exports.result = (res) => {
    res.status(200).end();
};

/**
 * Send an ok message over the network
 * @param {Response} res where to send the message
 * @param {Object} data the JSON data to send
 */
exports.resultWithJSON = (res, data) => {
    res.status(200).json(data);
};

/**
 * Send an ok message over the network
 * @param {Response} res where to send the message
 * @param {Object} data the JSON data to send
 */
exports.resultWithJSONNoImage = (res, data) => {
    res.status(210).json(data);
};

/**
 * Send a created message over the network
 * @param {Response} res where to send the message
 * @param {Object} item the user's data
 */
exports.itemCreated = (res, item) => {
    res.status(201).send(item);
};

/**
 * Send a created message over the network
 * @param {Response} res where to send the message
 * @param {Object} user the user's data
 */
exports.userCreated = (res, user) => {
    exports.itemCreated(res, user);
};

/**
 * Send a bad request message over the network
 * @param {Response} res where to send the message
 */
exports.badRequest = (res) => {
    res.status(400).end();
};

/**
 * Send a bad request message over the network
 * @param {Response} res where to send the message
 * @param {Object} msg the message to send 
 */
exports.badRequestJSON = (res, msg) => {
    res.status(400).json(msg);
};

/**
 * Send a user not found request message over the network
 * @param {Response} res where to send the message
 */
exports.userNotFound = (res) => {
    exports.notFound(res,{ description: 'User not found.'});
};

/**
 * Send a group not found request message over the network
 * @param {Response} res where to send the message
 */
exports.groupNotFound = (res) => {
    exports.notFound(res,{ description: 'Group not found.'});
};

/**
 * 
 * @param {Response} res where to send the message
 */
exports.notContentRetrieved = (res) => {
    res.status(204).end();
};

/**
 * Send a not found request message over the network
 * @param {Response} res where to send the message
 * @param {*} jsonData the message to sen<d
 */
exports.notFound = (res, jsonData) => {
    res.status(404).send(jsonData);
};

/**
 * Replay response from UserServise or EventService
 * @param {response} response response to replay
 * @param {res} res where send response
 */
exports.replayResponse = (response, res) => {
    if (response.status === 200) {
        exports.resultWithJSON(res, response.data);
    } else if (response.status === 201) {
        exports.itemCreated(res, response.data);
    } else if (response.status === 204) {
        exports.notContentRetrieved(res);
    } else {
        exports.replayError(response, res);
    }
}

exports.replayError = (response,res) => {
    if (response.status === 404){
        exports.notFound(res, response.data);
    } else if (response.status === 500) {
        exports.internalError(res, response.data);
    } else if (response.status === 400) {
        exports.badRequestJSON(res, response.data);
    }
}