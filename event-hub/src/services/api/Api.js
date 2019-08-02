import Axios from 'axios'

/**
 * @param promise {Promise}
 * @param httpSuccessfulCodes {Array}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let managePromise = (promise, httpSuccessfulCodes, onError, onSuccess) => {
    promise
        .then(response => {
            console.log("RESPONSE: ")
            console.log(response)
            if (!response || !httpSuccessfulCodes.includes(response.status))
                onError(response)
            else
                onSuccess(response)
        })
        .catch(error => {
            console.log("ERROR: ")
            console.log(error)
            onError(error)
        })
}

/**
 * Map a received event datas to a well known data structure.
 * @param event {object}
 * @returns {{date: *, description: *, creationDate: *, maxParticipants: *, organizator: *, typology: *, followers: *, public: *, reviews: *, name: *, _id: *, participants: *, numParticipants: *}}
 */
let mapEvent = (event) => {
    let address = event.address ? {
        lat: event.address.lat,
        lng: event.address.lng,
        city: event.address.city
    } : {}
    return {
        creationDate: event.creationDate,
        date: event.date,
        description: event.description,
        followers: event.followers ? event.followers : [],
        maxParticipants: event.maximumParticipants,
        name: event.name,
        organizator: mapUser(event.organizator),
        participants: event.participants ? event.participants : [],
        numParticipants: event.participants ? event.participants.length : 0,
        public: event.public,
        reviews: event.reviews ? event.reviews : [],
        typology: event.typology,
        _id: event._id,
        address: address
    }
}

/**
 * Map a received user data to a well known data structure.
 * @param user
 * @returns {{birthdate: *, address: *, gender: *, reviewsReceived: (*|[]), eventsSubscribed: (*|[]), groups: *, avatar: *, reviewsDone: (*|[]), points: *, badges: *, linkedUsers: *, nReviewsReceived: (*|number), eventsFollowed: (*|[]), phone: *, surname: *, organization: *, name: *, _id: *, email: *, nReviewsDone: (*|number)}}
 */
let mapUser = (user) => {
    let address = user.address ? {
        city: user.address.city
    } : {}
    return {
        _id: user._id,
        linkedUsers: user.linkedUsers ? user.linkedUsers : [],
        name: user.name,
        surname: user.surname,
        organization: user.organization,
        gender: user.gender,
        birthdate: user.birthdate,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
        groups: user.groups ? user.groups : [],
        badges: user.badges ? user.badges : [],
        points: user.points,
        nReviewsDone: user.reviewsDone ? user.reviewsDone.length : 0,
        reviewsDone: user.reviewsDone ? user.reviewsDone : [],
        nReviewsReceived: user.reviewsReceived ? user.reviewsReceived.length : 0,
        reviewsReceived: user.reviewsReceived ? user.reviewsReceived : [],
        eventsSubscribed: user.eventsSubscribed ? user.eventsSubscribed : [],
        eventsFollowed: user.eventsFollowed ? user.eventsFollowed : [],
        address: address
    }
}

let mapNotification = (notification) => {
    return {
        _id: notification._id,
        typology: notification.typology,
        sender: mapUser(notification.sender),
        event: notification.event ? mapEvent(notification.event) : {},
        timestamp: notification.timestamp
    }
}

/**
 * @param data {object}
 * @param data.fromIndex {number}
 * @param data.event {object}
 * @param data.event.typology {string}
 * @param data.event.location {object}
 * @param data.event.location.lat {number}
 * @param data.event.location.lng {number}
 * @param data.event.location.maxDistanceInMetres {string}
 * @param data.event.date {object}
 * @param data.event.date.value {Date}
 * @param data.event.date.operator {string}
 * @param data.event.public {boolean}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let getEvents = (data, onError, onSuccess) => {
    let config = {}
    let index = 0
    if (data) {
        if (data.event) {
            let date = undefined
            if (data.event.date) {
                date = {
                    value: data.event.date.value,
                    operator: data.event.date.operator
                }
            }
            let location = undefined
            if (data.event.location) {
                location = {
                    lon: data.event.location.lng,
                    lat: data.event.location.lat,
                    maxDistance: data.event.location.maxDistanceInMetres
                }
            }
            config.params = {
                typology: data.event.typology,
                location: location,
                date: date,
                public: data.event.public
            }
        }
        if (data.fromIndex)
            index = data.fromIndex
    }
    managePromise(
        Axios.get('/events/' + index, config),
        [201, 200],
        onError,
        response => onSuccess(response.data.map(mapEvent))
    )
}

/**
 * @param data {object}
 * @param data.event {object}
 * @param data.event.name {string}
 * @param data.event.typology {string}
 * @param data.event.location {object}
 * @param data.event.location.lat {number}
 * @param data.event.location.lng {number}
 * @param data.event.location.place_id {string}
 * @param data.event.location.address {string}
 * @param data.event.date {object}
 * @param data.event.date.value {boolean}
 * @param data.event.date.operator {string}
 * @param data.event.public {boolean}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let searchEvents = (data, onError, onSuccess) => {
    let config = {
        params: {
            typology: data.event.typology,
            location: data.event.location,
            date: data.event.date
        }
    }
    managePromise(
        Axios.get('/events/search/' + data.event.name, config),
        [200],
        onError,
        response => onSuccess(response.data.map(mapEvent))
    )
}

/**
 * @param event {object}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let createNewEvent = (event, onError, onSuccess) => {
    managePromise(
        Axios.post('/event', event),
        [201],
        onError,
        response => onSuccess(mapEvent(response.data))
    )
}

/**
 * @param eventId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let participateToEvent = (eventId, onError, onSuccess) => {
    interactWithEvent(
        {participant: true, event: eventId},
        () => onError("Errore durante la partecipazione ad un evento. Riprovare."),
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
        () => onError("Errore nel tentativo di seguire un evento. Riprovare."),
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
        Axios.post("/users/event", data),
        [201],
        onError,
        onSuccess
    )
}

/**
 * @param fromIndex {number}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let getNotifications = (fromIndex, onError, onSuccess) => {
    managePromise(
        Axios.get('/notifications/' + fromIndex),
        [200],
        onError,
        response => onSuccess(response.data.map(mapNotification))
    )
}

/**
 * @param friendId {string}
 * @param accepted {boolean}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let sendFriendshipResponse = (friendId, accepted, onError, onSuccess) => {
    let data = {
        firend: friendId,
        accepted: accepted
    }
    managePromise(
        Axios.post('/notifications/friendship', data),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param position {object}
 * @param position.lat {number}
 * @param position.lon {number}
 * @param accepted {boolean}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let sendFriendPositionResponse = (position, accepted, onError, onSuccess) => {
    let data = {
        position: position,
        accepted: accepted
    }
    managePromise(
        Axios.post('/notifications/friendposition', data),
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
        Axios.post('/notification', data),
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
        Axios.get('/event/info/' + eventId),
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
 * @param data {object}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let register = (data, onError, onSuccess) => {
    managePromise(
        Axios.post('/registration', data),
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
    managePromise(
        Axios.put('/profile', data),
        [200],
        onError,
        response => onSuccess(mapUser(response.data))
    )
}

/**
 * @param data {object}
 * @param data.email {string}
 * @param data.password {string}
 * @param data.newEmail {string}
 * @param data.newPassword {string}
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
 * @param name {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let searchUsers = (name, onError, onSuccess) => {
    managePromise(
        Axios.get('/users/search/' + name),
        [200],
        onError,
        response => onSuccess(response.data.map(mapUser))
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
    let data = { friend: friendId }
    managePromise(
        Axios.delete('/users/friendship', data),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param imageName {string}
 * @returns {string}
 */
let getImageUrl = (imageName) => {
    return "/images/" + imageName
}

export default {
    createNewEvent,
    getEvents,
    searchEvents,
    participateToEvent,
    followEvent,
    getNotifications,
    sendFriendshipResponse,
    sendFriendPositionResponse,
    notificationRead,
    getEventInformation,
    login,
    register,
    updateUserProfile,
    updateUserCredentials,
    updateUserSettings,
    getUserInformation,
    searchUsers,
    sendFriendshipRequest,
    sendFriendPositionRequest,
    removeFriend,
    getImageUrl
}