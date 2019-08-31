const network = require('./network')
const axios = require('axios')

exports.getGroupName = (req, res) => {
    axios.get(`${UserServiceServer}/users/${req.user._id}`)
    .then(response => {
        groups = response.data.groups
        if(groups == null || groups.length == 0){
            //Response group not found
        } else {
            let promise = groups.map(g => exports.getGroupInfoRequest(g))
            Promise.all(promise)
            .then(response => {
                let results = []
                response.data.forEach(g => results.push(g))
                network.resultWithJSON(res, results)
            })
            .catch((err) => network.internalError(res, err))
        }
    })
    .catch((err) => network.internalError(res, err))
}

exports.createGroup = (req, res) => {
    if(req.body.name){
        let data = {
            name: req.body.name,
            user: req.user._id,
        }
        axios.post(`${UserServiceServer}/group`, data)
        .then(resposne => network.replayResponse(resposne, res))
        .catch((err) => network.internalError(res, err))
    } else {
        network.internalError(res, {description: 'errore interno loool'})
    }
}

exports.add_remove_UserToGroup = (req, res) => {
    if(add_remove_option_validation(req.body.options)){
        options = req.body.options
        let params = {
            group: req.params.groupId,
            user: options.user
        }
        if(options.isToRemove){
            removeUserFromGroup(res, params)
        }else{
            addUserToGroup(res, params)
        }
    }else{
        network.badRequest(res)
    }
}

exports.getGroupInfo = (req, res) => {
    axios.delete(`${UserServiceServer}/group/${req.params.groupId}`)
    .then(resposne => {
        let group = response.data
        let partPromise = group.members.map(m => axios.get(`${UserServiceServer}/users/${m}`))
        Promise.all(partPromise)
        .then(response2 => {
            group.members = response2;
            network.resultWithJSON(res, response2)
        })
        .catch((err) => network.internalError(res, err))
    })
    .catch((err) => network.internalError(res, err))
}

exports.deleteGroup = (req, res) => {
    axios.delete(`${UserServiceServer}/group/${req.params.groupId}`)
    .then(resposne => network.replayResponse(resposne, res))
    .catch((err) => network.internalError(res, err))
}

// ! queste funzioni si potrebbero unire visto che sono molto simili 
let removeUserFromGroup = (res, option) => {
    axios.delete(`${UserServiceServer}/user/${option.user}/groups`, {group: option.group})
    .then(resposne => network.replayResponse(resposne, res))
    .catch((err) => network.internalError(res, err))
}
let addUserToGroup = (res, option) => {
    axios.post(`${UserServiceServer}/user/${option.user}/groups`, {group: option.group})
    .then(resposne => network.replayResponse(resposne, res))
    .catch((err) => network.internalError(res, err))
}
// !-----------------------------------------------------------

let add_remove_option_validation = (option) => {
    let temp = {
        isToRemove: true, //l'elemneto è da rimuovere, altrimenti da aggiungere
        user: '' // id da aggiungere o da rimuovere
    }
    if((option.isToRemove !== null && typeof(option.isToRemove) === 'boolean') && 
    (option.user && typeof(option.isToRemove) === 'string' )){
        return true
    }else{
        return false
    }
}