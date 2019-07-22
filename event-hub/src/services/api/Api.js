import Axios from 'axios'
import Properties from '../../utils/Properties'

/**
 * @param promise {Promise}
 * @param httpSuccessfulCodes {Array}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let managePromise = (promise, httpSuccessfulCodes, onError, onSuccess) => {
    promise
        .then(response => {
            if (!response || !httpSuccessfulCodes.includes(response.status))
                onError(response)
            else
                onSuccess(response)
        })
        .catch(error => onError(error))
}

/**
 * @param data {object}
 * @param data.fromIndex {number}
 * @param data.event {object}
 * @param data.event.typology {string}
 * @param data.event.location {object}
 * @param data.event.location.lat {number}
 * @param data.event.location.lng {number}
 * @param data.event.location.place_id {string}
 * @param data.event.location.address {string}
 * @param data.event.date {Date}
 * @param onError: {function(error)}
 * @param onSuccess {function(response)}
 */
let getEvents = (data, onError, onSuccess) => {
    let config = {
        params: {
            typology: data.typology,
            location: data.location,
            date: data.date
        }
    }
    managePromise(
        Axios.get(Properties.apiServer + '/events/' + data.fromIndex, config),
        [200],
        onError,
        onSuccess
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
 * @param data.event.date {Date}
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
        Axios.get(Properties.apiServer + '/events/search/' + data.event.name, config),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param event {object}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let createNewEvent = (event, onError, onSuccess) => {
    managePromise(
        Axios.post(Properties.apiServer + '/event', event),
        [201],
        onError,
        onSuccess
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
        Axios.post(Properties.apiServer + "/users/event", data),
        [200],
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
        Axios.get(Properties.apiServer + '/notifications/' + fromIndex),
        [200],
        onError,
        onSuccess
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
        Axios.post(Properties.apiServer + '/notifications/friendship', data),
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
        Axios.post(Properties.apiServer + '/notifications/friendposition', data),
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
        Axios.post(Properties.apiServer + '/notification', data),
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
        Axios.get(Properties.apiServer + '/events/info/' + eventId),
        [200],
        onError,
        onSuccess
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
        Axios.post(Properties.apiServer + '/login', data),
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
    managePromise(
        Axios.post(Properties.apiServer + '/registration', data),
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
let updateUserProfile = (data, onError, onSuccess) => {
    managePromise(
        Axios.put(Properties.apiServer + '/profile', data),
        [200],
        onError,
        onSuccess
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
        Axios.put(Properties.apiServer + '/profile/credentials', data),
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
let updateUserSettings = (data, onError, onSuccess) => {
    managePromise(
        Axios.put(Properties.apiServer + '/profile/settings', data),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param userId {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let getUserInformation = (userId, onError, onSuccess) => {
    managePromise(
        Axios.get(Properties.apiServer + '/users/' + userId),
        [200],
        onError,
        onSuccess
    )
}

/**
 * @param name {string}
 * @param onError {function(error)}
 * @param onSuccess {function(response)}
 */
let searchUsers = (name, onError, onSuccess) => {
    managePromise(
        Axios.get(Properties.apiServer + '/users/search/' + name),
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
let sendFriendshipRequest = (friendId, onError, onSuccess) => {
    let data = { friend: friendId }
    managePromise(
        Axios.post(Properties.apiServer + '/users/friendship', data),
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
        Axios.post(Properties.apiServer + '/users/friendposition', data),
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
        Axios.delete(Properties.apiServer + '/users/friendship', data),
        [200],
        onError,
        onSuccess
    )
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
    removeFriend
}