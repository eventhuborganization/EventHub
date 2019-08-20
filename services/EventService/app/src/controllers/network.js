/**
 * Send an internal error over the network
 * @param {*} res where to send the message
 * @param {*} err the error
 */
exports.internalError = (res, err) => {
    res.status(500).send(err);
};

/**
 * Send an ok message over the network
 * @param {*} res where to send the message
 */
exports.result = (res) => {
    res.status(200).end();
};

/**
 * Send an ok message over the network
 * @param {*} res where to send the message
 * @param {Object} data the JSON data to send
 */
exports.resultWithJSON = (res, data) => {
    res.status(200).json(data);
};

/**
 * Send a created message over the network
 * @param {*} res where to send the message
 * @param {Object} item the event's data
 */
exports.itemCreated = (res, item) => {
    res.status(201).send(item);
};

/**
 * Send a created message over the network
 * @param {*} res where to send the message
 * @param {Object} event the event's data
 */
exports.eventCreated = (res, event) => {
    exports.itemCreated(res, event);
};

/**
 * Send a bad request message over the network
 * @param {*} res where to send the message
 */
exports.badRequest = (res) => {
    res.status(400).end();
};

/**
 * Send a bad request message over the network
 * @param {*} res where to send the message
 * @param {Object} msg the message to send 
 */
exports.badRequestJSON = (res, msg) => {
    res.status(400).json(msg);
};

/**
 * Send a event not found request message over the network
 * @param {*} res where to send the message
 */
exports.eventNotFound = (res) => {
    exports.notFound(res,{ description: 'Event not found.'});
};

exports.notContentRetrieved = (res) => {
    res.status(204).end();
};

/**
 * Send a not found request message over the network
 * @param {*} res where to send the message
 * @param {*} jsonData the message to sen<d
 */
exports.notFound = (res, jsonData) => {
    res.status(404).send(jsonData);
};