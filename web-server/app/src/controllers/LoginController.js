const network = require('./network')
const axios = require('axios')
const passport = require('passport') //tentativo
const path = require('path')
const fs = require("fs")

exports.getLogin = (req, res) => {
    res.sendFile(`${appRoot}/views/login.html`)
}

exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user) => {
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
    console.log(req.body);
    let data = JSON.parse(req.body.data)
    console.log(data);
    data.sex = data.gender
    data.phoneNumber = data.phone
    data.profilePicture = req.file ? path.extname(req.file.originalname).toLowerCase() : ""
    delete data.gender
    delete data.phone
    delete data.avatar
    axios.post(UserServiceServer + "/users", data)
        .then(response => {
            if (req.file) {
                let imageName = response.data.profilePicture
                let targetPath = path.join(__dirname, ("../../public/images/users/" + imageName))
                fs.rename(req.file.path, targetPath, error => {
                    if (error) {
                        data.profilePicture = ""
                        console.log(error)
                        for(let notDone=4; notDone; ) {
                            axios.put(`${UserServiceServer}/users/${response.data._id}`, data)
                                .then(user => {
                                    notDone=false
                                    network.resultWithJSONNoImage(res, user.data)
                                })
                                .catch(err => {notDone--})
                        }
                        network.resultWithJSONNoImage(res, user.data)
                    } else {
                        network.replayResponse(response, res)
                    }
                })
            } else {
                network.replayResponse(response, res)
            } 
        })
        .catch(err => network.internalError(res, err))
}