exports.home = "/"
exports.defaultRoot = "/app"

exports.menu = exports.defaultRoot + "/menu"
exports.settings = exports.defaultRoot + "/settings"
exports.login = exports.defaultRoot + "/login"
exports.registration = exports.defaultRoot + "/register"

exports.newEvent = exports.defaultRoot + "/events/new"
exports.newGroup = exports.defaultRoot + "/groups/new"
exports.map = exports.defaultRoot + "/map"
exports.inviteEvent = exports.defaultRoot + "/invite/event"
exports.inviteGroup = exports.defaultRoot + "/invite/group"

exports.updateEvent = exports.defaultRoot + "/events/:id/update"
exports.eventReviews = exports.defaultRoot + "/events/:id/reviews"
exports.event = exports.defaultRoot + "/events/:id"
exports.user = exports.defaultRoot + "/users/:id"
exports.userFriends = exports.defaultRoot + "/users/:id/friends"
exports.group = exports.defaultRoot + "/groups/:id"

exports.myProfile = exports.defaultRoot + "/profile"
exports.myNotifications = exports.defaultRoot + "/notifications"
exports.myFriends = exports.defaultRoot + "/friends"
exports.myGroups = exports.defaultRoot + "/groups"
exports.myEvents = exports.defaultRoot + "/myEvents"
exports.myProgresses = exports.defaultRoot + '/myProgresses'
exports.myReviews = exports.defaultRoot + "/myReviews"

exports.subscribedEvents = exports.defaultRoot + "/eventsOfInterest"
exports.reviewsReceived = exports.defaultRoot + "/reviewReceived"

exports.updateEventFromId = id => exports.defaultRoot + "/events/" + id + "/update"
exports.eventFromId = id => exports.defaultRoot + "/events/" + id
exports.userFromId = id => exports.defaultRoot + "/users/" + id
exports.groupFromId = id => exports.defaultRoot + "/groups/" + id
exports.eventReviewsById = id => exports.defaultRoot + "/events/" + id + "/reviews"
exports.usersFriendsFromId = id => exports.defaultRoot + "/users/" + id + "/friends"
exports.usersFriendsFromPath = path => path + "/friends"