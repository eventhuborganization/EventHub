

function updateUserEvents(req, res, updates) {
    if (checkIfEventsUpdateIsABadRequest(req.body))
        badRequest(res);
    Users.findByIdAndUpdate(req.params.uuid, updates,
        (err, model) => {
            if (err)
                internalError(res, err);
            else if (!model)
                userNotFound(res);
            else
                result(res);
        });
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

function isNewActionWellFormed(action) {
    return action && action.type && action.points;
}

function isNewReviewWellFormed(review) {
    return review && review.writer && review.event && review.text && review.date && review.evaluation;
}

function internalError(res, err) {
    res.status(500).send(err);
}

function result(res) {
    res.status(200).end();
}

function resultWithJSON(res, data) {
    res.status(200).json(data);
}

function itemCreated(res, item) {
    res.status(201).send(item);
}

function badRequest(res) {
    res.status(400).end();
}

function userNotFound(res) {
    res.status(404).send({ description: 'User not found.'});
}

function notContentRetrieved(res) {
    res.status(204).end();
}