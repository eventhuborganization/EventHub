const network = require('./network')
const UserService = require('../API/UserServiceAPI')
const axios = require('axios')

exports.getGroupName = (req, res) => {
    UserService.getUserInfo(req.user._id)
    .then(response => {
        let groups = response.data.groups
        if(groups === null || groups.length === 0){
            network.groupNotFound(res)
        } else {
            let promise = groups.map(g => UserService.getGroupInfo(g))
            Promise.all(promise)
            .then(response => {
                let results = response.map(group => {
                    let newGroup = group.data
                    newGroup.members = newGroup.members.map(id => {return {_id: id}})
                    return newGroup
                })
                network.resultWithJSON(res, results)
            })
            .catch((err) => {
                console.log(err)
                network.replayError(err, res)
            })
        }
    })
    .catch((err) => {
        console.log(err)
        network.internalError(res, err)
    })
}

exports.createGroup = (req, res) => {
    if(req.body.name){
        let data = {
            name: req.body.name,
            users: [req.user._id],
        }
        if(req.body.users){
            data.users = data.users.concat(req.body.users)
        }
        UserService.createGroup(data)
            .then(response => {
                data.users.forEach( () => UserService.addAction(req.user._id, 11))
                response.data.members = response.data.members.map(id => {return {_id: id}})
                network.replayResponse(response, res)
            })
            .catch((err) => network.internalError(res, err))
    } else {
        network.badRequest(res)
    }
}

exports.addOrRemoveUserToGroup = (req, res) => {
    if(isDataWellFormed(req.body)){
        let params = {
            group: req.params.groupId,
            user: req.body.user
        }
        operateWithUserToGroup(
            req.body.isToRemove,
            params,
            req,
            res
        )
    } else {
        network.badRequest(res)
    }
}

exports.getGroupInfo = (req, res) => {
    UserService.getGroupInfo(req.params.groupId)
        .then(response => {
            let group = response.data
            let partPromise = group.members.map(m => axios.get(`${UserServiceServer}/users/${m}`))
            Promise.all(partPromise)
                .then(response2 => {
                    group.members = response2.map(data => {
                        let member = data.data
                        let user = {
                            _id: member._id,
                            name: member.name,
                            surname: member.surname,
                            avatar: member.profilePicture,
                            address: member.address,
                            linkedUsers: member.linkedUsers.map(id => {return {_id: id}})
                        }
                        return user
                    })
                    network.resultWithJSON(res, group)
                })
                .catch(err => network.replayError(err, res))
        })
        .catch(err2 => network.internalError(res, err2))
}

let operateWithUserToGroup = (removing, options, req, res) => {
    let address = `${UserServiceServer}/users/${options.user}/groups`
    let firstOperation
    if(removing){
        firstOperation = axios.delete(address, {
            data: {
                group: options.group
            }
        })
    } else {
        firstOperation = axios.post(address, {group: options.group})
    }
    firstOperation
        .then(response => {
            if (!removing) {
                UserService.addAction(req.user._id, 11)
            }
            network.replayResponse(response, res)
        })
        .catch(err => network.replayError(err, res))
}

let isDataWellFormed = (option) => {
    if((option.isToRemove !== null && typeof(option.isToRemove) === 'boolean') && 
    (option.user && typeof(option.user) === 'string' )){
        return true
    }else{
        return false
    }
}