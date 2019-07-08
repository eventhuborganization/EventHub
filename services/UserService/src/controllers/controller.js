let mongoose = require('mongoose');
let request = require('request');
let commons = require('commons');

let Users = mongoose.model('Users');
let Reviews = mongoose.model('Reviews');
let Groups = mongoose.model('Groups');
let Actions = mongoose.model("Actions");
let Badges = mongoose.model("Badges");

/**
 * Get the user from an ID
 * @param {Schema.Types.ObjectId} userId the userId
 * @param {function(err, response)} callback the callback that will be called 
 */
function getUserById(userId, callback){
    Users.find().byId(userId).exec(callback);
}

exports.createNewUser = (req, res) => {
};

exports.deleteUser = (req, res) => {
};

exports.userLogin = (req, res) => {
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