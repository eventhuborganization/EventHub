exports.home = "/"
exports.menu = "/menu"
exports.settings = "/settings"
exports.login = "/login"
exports.registration = "/register"

exports.newEvent = "/events/new"
exports.newGroup = "/groups/new"
exports.map = "/map"
exports.inviteEvent = "/invite/event"
exports.inviteGroup = "/invite/group"

exports.updateEvent = "/events/:id/update"
exports.eventReviews = "/events/:id/reviews"
exports.event = "/events/:id"
exports.user = "/users/:id"
exports.userFriends = "/users/:id/friends"
exports.group = "/groups/:id"

exports.myProfile = "/profile"
exports.myNotifications = "/notifications"
exports.myFriends = "/friends"
exports.myGroups = "/groups"
exports.myEvents = "/myEvents"
exports.myProgresses = '/myProgresses'
exports.myReviews = "/myReviews"

exports.subscribedEvents = "/eventsOfInterest"
exports.reviewsReceived = "/reviewReceived"

exports.updateEventFromId = id => "/events/" + id + "/update"
exports.eventFromId = id => "/events/" + id
exports.userFromId = id => "/users/" + id
exports.groupFromId = id => "/groups/" + id
exports.eventReviewsById = id => "/events/" + id + "/reviews"
exports.usersFriendsFromId = id => "/users/" + id + "/friends"
exports.usersFriendsFromPath = path => path + "/friends"