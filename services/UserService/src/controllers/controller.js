let mongoose = require('mongoose');
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
};

/**
 * Hash password with sha512.
 * @param {String} password list of required fields
 * @param {String} salt data to be validated
 */
function sha512(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};

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

