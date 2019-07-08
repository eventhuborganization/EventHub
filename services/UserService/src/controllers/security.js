let crypto = require('crypto');

/**
 * Generates random string of characters i.e salt
 * @param {number} length length of the random string
 */
function genRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
}

/**
 * Hash password with sha512.
 * @param {String} password the password to hash
 * @param {String} salt the salt to hash the password with
 */
function sha512(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
}

/**
 * Hash a password
 * @param {String} password the password to hash 
 */
function hashPassword(password) {
    let salt = genRandomString(16);
    let password = sha512(password, salt);
    return {
        salt: salt,
        pwd: password
    };
}