import Axios from 'axios'

let notAuthenticatedBehaviour = undefined
let onNotAuthenticated = (onError, data) => {
    if (notAuthenticatedBehaviour)
        notAuthenticatedBehaviour()
    else
        onError(data)
}

let setNotAuthenticatedBehaviour = behaviour => {
    notAuthenticatedBehaviour = behaviour
}

let checkIfIsNotAuthenticated = response => {
    return response && response.status && response.status === 401
}

/**
 * @param promise {Promise}
 * @param httpSuccessfulCodes {Array}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let managePromise = (promise, httpSuccessfulCodes, onError, onSuccess) => {
    promise
        .then(response => {
            /*console.log("RESPONSE: ")
            console.log(response)*/
            if (checkIfIsNotAuthenticated(response))
                onNotAuthenticated(onError, response)
            else if (!response || !httpSuccessfulCodes.includes(response.status))
                onError(response)
            else {

                onSuccess(response)
            }
        })
        .catch(error => {
            /*console.log("ERROR: ")
            console.log(error)
            console.log(error.response)*/
            if (checkIfIsNotAuthenticated(error.response))
                onNotAuthenticated(onError, error)
            else
                onError(error)
        })
}

/**
 * Map a received event data to a well known data structure.
 * @param event {object}
 * @returns {{date: *, description: *, creationDate: *, maxParticipants: *, organizator: *, typology: *, followers: *, public: *, reviews: *, name: *, _id: *, participants: *, numParticipants: *}}
 */
let mapEvent = (event) => {
    let location = event.location ? {
        address: event.location.city
    } : {}
    if(event.location.geo && event.location.geo.coordinates){
        location.lat = event.location.geo.coordinates[1]
        location.lng = event.location.geo.coordinates[0]
    }
    return {
        creationDate: new Date(event.creationDate),
        date: event.date ? new Date(event.date) : new Date(event.eventDate),
        description: event.description,
        followers: event.followers || [],
        maxParticipants: event.maxParticipants || event.maximumParticipants,
        name: event.name,
        organizator: mapUser(event.organizator),
        participants: event.participants || [],
        numParticipants: event.participants ? event.participants.length : 0,
        public: event.public,
        reviews: event.reviews || [],
        typology: event.typology,
        _id: event._id,
        location: location,
        thumbnail: event.thumbnail
    }
}

/**
 * Map a received user data to a well known data structure.
 * @param user {object}
 * @returns {{birthdate: *, address: *, gender: *, reviewsReceived: (*|[]), eventsSubscribed: (*|[]), groups: *, avatar: *, reviewsDone: (*|[]), points: *, badges: *, linkedUsers: *, nReviewsReceived: (*|number), eventsFollowed: (*|[]), phone: *, surname: *, organization: *, name: *, _id: *, email: *, nReviewsDone: (*|number)}}
 */
let mapUser = (user) => {
    let address = user.address ? {
        city: user.address.city
    } : {}
    let eventsSubscribed = []
    if(user.nextEventSubscribed){
        eventsSubscribed = eventsSubscribed.concat(user.nextEventSubscribed.map(elem => mapEvent(elem)))
    }
    if(user.lastEventSubscribed){
        eventsSubscribed = eventsSubscribed.concat(user.lastEventSubscribed.map(elem => mapEvent(elem)))
    }
    return {
        _id: user._id,
        linkedUsers: user.linkedUsers || [],
        name: user.name,
        surname: user.surname,
        organization: user.organization,
        gender: user.gender || user.sex,
        birthdate: user.birthdate,
        phone: user.phone || user.phoneNumber,
        email: user.email,
        avatar: user.avatar || user.profilePicture,
        groups: user.groups || [],
        badges: user.badges || [],
        points: user.points,
        nReviewsDone: user.reviewsDone ? user.reviewsDone.length : 0,
        reviewsDone: user.reviewsDone || [],
        nReviewsReceived: user.reviewsReceived ? user.reviewsReceived.length : 0,
        reviewsReceived: user.reviewsReceived ? user.reviewsReceived : [],
        eventsSubscribed: eventsSubscribed,
        eventsFollowed: user.eventsFollowed || [],
        address: address
    }
}

/**
 * Map a received position to a well known data structure.
 * @param position {object}
 * @returns {{typology: *, sender: *, _id: *, event: *, timestamp: *}}
 */
let mapPosition = (position) => {
    return {
        lat: position.lat,
        lng: position.lon
    }
}

/**
 * Map a received notification to a well known data structure.
 * @param notification {{
 *     _id: string,
 *     typology: number,
 *     sender: object,
 *     event: object,
 *     timestamp: string
 * }}
 * @returns {{typology: *, sender: *, _id: *, event: *, timestamp: *, position: *}}
 */
let mapNotification = (notification) => {
    return {
        _id: notification._id,
        typology: notification.typology,
        timestamp: new Date(notification.timestamp),
        sender: notification.sender ? mapUser(notification.sender) : {},
        event: notification.data && notification.data.event ? mapEvent(notification.data.event) : {},
        position: notification.data && notification.data.position ? mapPosition(notification.data.position) : {}
    }
}

/**
 * Map a received group to a well known data structure.
 * @param group {{
 *     _id: string,
 *     name: string,
 *     avatar: string
 * }}
 * @return {{name: string, _id: string, avatar: string}}
 */
let mapGroup = (group) => {
    return {
        _id: group._id,
        name: group.name,
        avatar: group.avatar,
        members: group.members.map(mapUser)
    }
}

/**
 * @param data {{
 *     event: {
 *         typology: string,
 *         location: {
 *             lat: number,
 *             lng: number,
 *             maxDistanceInMetres: number,
 *             place_id: string,
 *             address: string
 *         },
 *         date: {
 *             value: Date,
 *             operator: string
 *         },
 *         public: boolean,
 *         name: string
 *     }
 * }}
 */
let createEventQueryConfigs = (data) => {
    let config = {}
    if (data) {
        if (data.event) {
            config.params = {
                typology: data.event.typology,
                public: data.event.public
            }
            if (data.event.location) {
                config.params.location = {
                    lon: data.event.location.lng,
                    lat: data.event.location.lat,
                    maxDistance: data.event.location.maxDistanceInMetres,
                    address: data.event.location.address,
                    place_id: data.event.location.place_id
                }
            }
            if (data.event.date) {
                config.params.date = {
                    value: data.event.date.value,
                    operator: data.event.date.operator
                }
            }
        }
    }
    return config
}

/**
 * @param data {{
 *     fromIndex: number,
 *     event: {
 *         typology: string,
 *         location: {
 *             lat: number,
 *             lng: number,
 *             maxDistanceInMetres: number
 *         },
 *         date: {
 *             value: Date,
 *             operator: string
 *         },
 *         public: boolean
 *     }
 * }}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let getEvents = (data, onError, onSuccess) => {
    let config = createEventQueryConfigs(data)
    let index = data && data.fromIndex ? data.fromIndex : 0
    managePromise(
        Axios.get('/events/' + index, config),
        [201, 200],
        onError,
        response => onSuccess(response.data.map(mapEvent))
    )
}

/**
 * @param data {{
 *     event: {
 *         typology: string,
 *         location: {
 *             lat: number,
 *             lng: number,
 *             maxDistanceInMetres: number,
 *             place_id: string,
 *             address: string
 *         },
 *         date: {
 *             value: Date,
 *             operator: string
 *         },
 *         public: boolean,
 *         name: string
 *     }
 * }}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let searchEvents = (data, onError, onSuccess) => {
    let config = createEventQueryConfigs(data)
    let name = data && data.event ? data.event.name : ""
    managePromise(
        Axios.get('/events/search/' + name, config),
        [200],
        onError,
        response => onSuccess(response.data.map(mapEvent))
    )
}

/**
 * @param data {{
 *     event: {
 *         typology: string,
 *         location: {
 *             lat: number,
 *             lng: number,
 *             maxDistanceInMetres: number,
 *             place_id: string,
 *             address: string
 *         },
 *         date: {
 *             value: Date,
 *             operator: string
 *         },
 *         public: boolean
 *     }
 * }}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let searchNearestEvents = (data, onError, onSuccess) => {
    let config = createEventQueryConfigs(data)
    managePromise(
        Axios.get('/events/position/near', config),
        [200],
        onError,
        response => onSuccess(response.data.map(mapEvent))
    )
}

/**
 * @param event {{
 *     name: string,
 *     description: string,
 *     date: Date,
 *     location: {
 *         lat: number,
 *         lng: number
 *     },
 *     public: boolean,
 *     typology: string,
 *     thumbnail: object,
 *     maxParticipants: number,
 *     organizator: object
 * }}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let createNewEvent = (event, onError, onSuccess) => {
    let form = new FormData()
    form.append("name", event.name)
    form.append("description", event.description)
    form.append("date", event.date)
    form.append("locationLat", event.location.lat)
    form.append("locationLng", event.location.lng)
    form.append("locationAddress", event.location.address)
    form.append("public", event.public)
    form.append("typology", event.typology)
    form.append("thumbnail", event.thumbnail)
    form.append("maxParticipants", event.maxParticipants)
    form.append("organizator", event.organizator._id)
    
    Axios.post('/events', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => onSuccess(response.data._id))
    .catch(onError)
}

/**
 * @param eventId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let participateToEvent = (eventId, onError, onSuccess) => {
    interactWithEvent(
        {participant: true, event: eventId},
        onError,
        onSuccess
    )
}

/**
 * @param eventId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let followEvent = (eventId, onError, onSuccess) => {
    interactWithEvent(
        {follower: true, event: eventId},
        onError,
        onSuccess
    )
}

/**
 * @param data {object}
 * @param data.follower {boolean}
 * @param data.participant {boolean}
 * @param data.event {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let interactWithEvent = (data, onError, onSuccess) => {
    managePromise(
        Axios.post("/user/event", data),
        [200],
        onError,
        response => onSuccess(mapEvent(response.data))
    )
}

/**
 * @param eventId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let unsubscribeToEvent = (eventId, onError, onSuccess) => {
    deselectEvent(
        {participant: true, event: eventId},
        onError,
        onSuccess
    )
}

/**
 * @param eventId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let unfollowEvent = (eventId, onError, onSuccess) => {
    deselectEvent(
        {follower: true, event: eventId},
        onError,
        onSuccess
    )
}

/**
 * @param data {object}
 * @param data.follower {boolean}
 * @param data.participant {boolean}
 * @param data.event {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let deselectEvent = (data, onError, onSuccess) => {
    managePromise(
        Axios.delete("/user/event", {data: data}),
        [200],
        onError,
        response => onSuccess(mapEvent(response.data))
    )
}

/**
 * @param eventId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let deleteEvent = (eventId, onError, onSuccess) => {
    managePromise(
        Axios.delete("/events/info/" + eventId),
        [200],
        onError,
        () => onSuccess()
    )
}

/**
 * @param fromIndex {number}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let getNotifications = (fromIndex, onError, onSuccess) => {
    managePromise(
        Axios.get('/notifications/' + (fromIndex && fromIndex >=0 ? fromIndex : 0)),
        [200],
        onError,
        response => onSuccess(response.data.notifications.map(mapNotification))
    )
}

/**
 * @param friendId {string}
 * @param accepted {boolean}
 * @param notificationId {String}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let sendFriendshipResponse = (friendId, accepted, notificationId, onError, onSuccess) => {
    let data = {
        friend: friendId,
        accepted: accepted,
        _id: notificationId
    }
    managePromise(
        Axios.post('/notification/friendship', data),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param position {{
 *     lat: number,
 *     lng: number
 * }}
 * @param accepted {boolean}
 * @param friendId {string}
 * @param notificationId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let sendFriendPositionResponse = (position, accepted, friendId, notificationId, onError, onSuccess) => {
    let data = {
        position: {
            lat: position.lat,
            lng: position.lng
        },
        accepted: accepted,
        _id: notificationId,
        friend: friendId
    }
    managePromise(
        Axios.post('/notification/friendposition', data),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param notificationId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let notificationRead = (notificationId, onError, onSuccess) => {
    let data = { _id: notificationId}
    managePromise(
        Axios.post('/notifications', data),
        [200, 201],
        onError,
        onSuccess
    )
}

/**
 * @param eventId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let getEventInformation = (eventId, onError, onSuccess) => {
    managePromise(
        Axios.get('/events/info/' + eventId),
        [200],
        onError,
        response => onSuccess(mapEvent(response.data))
    )
}

/**
 *
 * @param email {string}
 * @param password {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let login = (email, password, onError, onSuccess) => {
    let data = {
        email: email,
        password: password
    }
    managePromise(
        Axios.post('/login', data),
        [200],
        onError,
        response => onSuccess(mapUser(response.data))
    )
}

/**
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let logout = (onError, onSuccess) => {
    managePromise(
        Axios.post('/logout'),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param data {object}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let register = (data, onError, onSuccess) => {
    let form = new FormData()
    if (data.avatar) {
        form.append('avatar', data.avatar)
        delete data.avatar
    }
    form.append('data', JSON.stringify(data));
    managePromise(
        Axios.post('/registration', form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }),
        [200, 201],
        onError,
        response => onSuccess(mapUser(response.data))
    )
}

/**
 * @param data {object}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let updateUserProfile = (data, onError, onSuccess) => {
    let form = new FormData()
    form.append('avatar', data.avatar)
    delete data.avatar
    form.append('data', JSON.stringify(data));
    managePromise(
        Axios.put('/profile', form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }),
        [200],
        onError,
        response => onSuccess(mapUser(response.data))
    )
}

/**
 * @param data {{
 *     email: string,
 *     password: string,
 *     newEmail: string,
 *     newPassword: string
 * }}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let updateUserCredentials = (data, onError, onSuccess) => {
    managePromise(
        Axios.put('/profile/credentials', data),
        [200],
        onError,
        response => onSuccess(mapUser(response.data))
    )
}

/**
 * @param data {object}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let updateUserSettings = (data, onError, onSuccess) => {
    managePromise(
        Axios.put('/profile/settings', data),
        [200],
        onError,
        response => onSuccess(mapUser(response.data))
    )
}

/**
 * @param eventId {string}
 * @param data {object}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let updateEventInfo = (eventId, data, onError, onSuccess) => {
    let form = new FormData()
    if(data.thumbnail){
        form.append('thumbnail', data.thumbnail)
        delete data.thumbnail
    }
    form.append('data', JSON.stringify(data));
    managePromise(
        Axios.put('/events/info/' + eventId, form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }),
        [200],
        onError,
        response => onSuccess(mapUser(response.data))
    )
}

/**
 * @param userId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let getUserInformation = (userId, onError, onSuccess) => {
    managePromise(
        Axios.get('/users/' + userId),
        [200],
        onError,
        response => onSuccess(mapUser(response.data))
    )
}

/**
 * @param users {Array}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let getUsersInformation = (users, onError, onSuccess) => {
    let promises = users.map(user => Axios.get('/users/' + user._id + '/info'))
    Axios.all(promises)
        .then(res => {
            let results = res.map(r => {
                let data = r.data
                data.address = {
                    city: data.city
                }
                delete data.city
                return data
            }) 
            onSuccess(results)
        })
        .catch(onError)
}

/**
 * @param name {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let searchUsers = (name, onError, onSuccess) => {
    managePromise(
        Axios.get('/users/search/' + name),
        [200],
        onError,
        response => onSuccess({users: response.data.users.map(mapUser)})
    )
}

/**
 * @param friendId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let sendFriendshipRequest = (friendId, onError, onSuccess) => {
    let data = { friend: friendId }
    managePromise(
        Axios.post('/users/friendship', data),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param organizationId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let followOrganization = (organizationId, onError, onSuccess) => {
    let data = { uuid: organizationId }
    managePromise(
        Axios.post('/users/follower', data),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param friendId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let sendFriendPositionRequest = (friendId, onError, onSuccess) => {
    let data = { friend: friendId }
    managePromise(
        Axios.post('/users/friendposition', data),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param friendId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let removeFriend = (friendId, onError, onSuccess) => {
    let data = { linkedUser: friendId }
    managePromise(
        Axios.delete('/users/friendship', {data: data}),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param onError {function}
 * @param onSuccess {function}
 */
let getGroups = (onError, onSuccess) => {
    managePromise(
        Axios.get("/users/groups"),
        [200],
        onError,
        response => onSuccess(response.data.map(mapGroup))
    )
}

/**
 * @param name {String}
 * @param members {Array}
 * @param onError {function}
 * @param onSuccess {function}
 */
let createGroup = (name, members, onError, onSuccess) => {
    let data = {name: name, users: members}
    managePromise(
        Axios.post("/users/groups", data),
        [200],
        onError,
        response => onSuccess(response.data.map(mapGroup))
    )
}

/**
 * @param groupId {String}
 * @param onError {function}
 * @param onSuccess {function}
 */
let getGroupInfo = (groupId, onError, onSuccess) => {
    managePromise(
        Axios.get("/users/groups/" + groupId),
        [200],
        onError,
        response => onSuccess(response.data.map(mapGroup))
    )
}

/**
 * @param groupId {String}
 * @param onError {function}
 * @param onSuccess {function}
 */
let deleteGroup = (groupId, onError, onSuccess) => {
    managePromise(
        Axios.delete("/users/groups/" + groupId),
        [200],
        onError,
        response => onSuccess(response.data.map(mapGroup))
    )
}

/**
 * @param groupId {String}
 * @param member {String}
 * @param onError {function}
 * @param onSuccess {function}
 */
let addMemberToGroup = (groupId, member, onError, onSuccess) => {
    let data = {isToRemove: false, user: member}
    managePromise(
        Axios.post("/users/groups" + groupId, data),
        [200],
        onError,
        response => onSuccess(response.data.map(mapGroup))
    )
}

/**
 * @param groupId {String}
 * @param member {String}
 * @param onError {function}
 * @param onSuccess {function}
 */
let removeMemberFromGroup = (groupId, member, onError, onSuccess) => {
    let data = {isToRemove: true, user: member}
    managePromise(
        Axios.post("/users/groups" + groupId, data),
        [200],
        onError,
        response => onSuccess(response.data.map(mapGroup))
    )
}

/**
 * @param userId {string}
 * @param eventId {string}
 * @param onError {function}
 * @param onSuccess {function}
 */
let inviteUser = (userId, eventId, onError, onSuccess) => {
    let data = {
        user: userId,
        event: eventId
    }
    managePromise(
        Axios.post("/invite", data),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param groupId {string}
 * @param eventId {string}
 * @param onError {function}
 * @param onSuccess {function}
 */
let inviteGroup = (groupId, eventId, onError, onSuccess) => {
    let data = {
        group: groupId,
        event: eventId
    }
    managePromise(
        Axios.post("/invite", data),
        [200],
        onError,
        onSuccess
    )
}

let mapReview = review => {
    return {
        _id: review._id,
        writer: mapUser(review.writer),
        eventId: review.event,
        date: review.date,
        text: review.text,
        evaluation: review.evaluation
    }
}

/**
 * @param review {{
 *     eventId: string,
 *     text: string,
 *     evaluation: number
 * }}
 * @param onError: function
 * @param onSuccess: function
 */
let writeReview = (review, onError, onSuccess) => {
    let data = {
        text: review.text,
        evaluation: review.evaluation
    }
    managePromise(
        Axios.post("/events/info/" + review.eventId + "/reviews", data),
        [200],
        onError,
        review => onSuccess(mapReview(review))
    )
}

/**
 * @param eventId: string
 * @param onError: function
 * @param onSuccess: function
 */
let getReviewsForEvent = (eventId, onError, onSuccess) => {
    managePromise(
        Axios.get("/events/info/" + eventId + "/reviews"),
        [200],
        onError,
        reviews => onSuccess(reviews.map(mapReview))
    )
}

/**
 * @param imageName {string}
 * @returns {string}
 */
let getImageUrl = (imageName) => {
    return "/images/" + imageName
}

/**
 * @param imageName {string}
 * @returns {string}
 */
let getAvatarUrl = (imageName) => {
    return "/avatars/" + imageName
}

export default {
    createNewEvent,
    deleteEvent,
    getEvents,
    searchEvents,
    searchNearestEvents,
    participateToEvent,
    followEvent,
    unsubscribeToEvent,
    unfollowEvent,
    followOrganization,
    getNotifications,
    sendFriendshipResponse,
    sendFriendPositionResponse,
    notificationRead,
    getEventInformation,
    login,
    logout,
    register,
    updateUserProfile,
    updateUserCredentials,
    updateUserSettings,
    updateEventInfo,
    getUserInformation,
    getUsersInformation,
    searchUsers,
    sendFriendshipRequest,
    sendFriendPositionRequest,
    removeFriend,
    getImageUrl,
    getAvatarUrl,
    setNotAuthenticatedBehaviour,
    getGroups,
    getGroupInfo,
    createGroup,
    deleteGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    inviteUser,
    inviteGroup,
    writeReview,
    getReviewsForEvent
}