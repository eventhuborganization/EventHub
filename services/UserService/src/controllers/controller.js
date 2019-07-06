let mongoose = require('mongoose');

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

