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

function internalError(res, err) {
    res.status(500).send(err);
}

function result(res) {
    res.status(200).send({});
}

function resultWithJSON(res, data) {
    res.status(200).json(data);
}

function userCreated(res) {
    res.status(201).send({});
}

function badRequest(res) {
    res.status(400).send({});
}

function userNotFound(res) {
    res.status(404).send({ description: 'User not found.'});
}