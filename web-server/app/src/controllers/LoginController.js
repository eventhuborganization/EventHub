const network = require('./network')
const axios = require('axios')
const passport = require('passport') //tentativo

exports.getLogin = (req, res) => {
    res.sendFile(`${appRoot}/views/login.html`)
}

exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err)
            network.internalError(res, err)
        else if (!user)
            res.status(400).send("Cannot log in")
        else
            req.login(user, () => network.resultWithJSON(res, user))
    })(req, res, next)
}

exports.logout = (req, res) => {
    req.logout()
    return res.send()
}

exports.registration = (req, res) => {
    let data = req.body
    data.sex = data.gender
    data.phoneNumber = data.phone
    data.profilePicture = data.avatar
    delete data.gender
    delete data.phone
    delete data.avatar
    axios.post(UserServiceServer + "/users", data)
        .then(response => network.replayResponse(response, res))
        .catch(err => network.internalError(res, err))
}