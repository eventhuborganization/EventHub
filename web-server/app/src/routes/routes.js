module.exports = (app) => {    
    var eventController = require('../controllers/EventController')
    var userController = require('../controllers/UserController')
    var notificationController = require('../controllers/NotificationController')
    var loginController = require('../controllers/LoginController')
    var reviewController = require('../controllers/ReviewController')
    let groupController = require('../controllers/GroupController')
    const {loginChecker} = require('../API/passport')
    let multer = require('multer')
    const path = require('path')

    const upload = multer({
        dest: __dirname + "../../../temp/files"
    });

    app.route("/")
        .get((req, res) => {
            //res.sendFile(path.join(__dirname, 'build', 'index.html'))
            res.status(200).end()
        })

    app.route('/images/:name')
        .get((req, res) => {
            res.sendFile(`${appRoot}/public/images/events/${req.params.name}`)
        })

    app.route('/avatars/:name')
        .get((req, res) => {
            res.sendFile(`${appRoot}/public/images/users/${req.params.name}`)
        })

    app.route('/badges/:name')
        .get((req, res) => {
            res.sendFile(`${appRoot}/public/images/badges/${req.params.name}`)
        })

    /* ----------------------------------------------- */

    app.route("/events")
        .post(
            loginChecker, 
            upload.single("thumbnail"), 
            eventController.createEvent
        )

    app.route('/events/info/:uuid')
        .get(eventController.eventInfo)
        .put(
            loginChecker,
            upload.single("thumbnail"), 
            eventController.updateEvent
        )
        .delete(
            loginChecker,
            eventController.deleteEvent
        )
    app.route('/events/info/complete/:uuid')
        .get(loginChecker, eventController.eventCompleteInfo)

    app.route('/events/position/near')
        .get(eventController.getEventsNear)

    app.route('/events/organizator/:uuid')
        .get(eventController.getEventsByOrganizator)

    app.route('/events/search/:name')
        .get(eventController.searchEventByName)

    app.route('/events/:fromIndex')
        .get(eventController.getEventsFromIndex)

    app.route('/user/event')
        .post(loginChecker, eventController.addUserToEvent)
        .delete(loginChecker, eventController.removeUserToEvent)

    /* ----------------------------------------------- */

    app.route("/users/groups")
        .get(loginChecker, groupController.getGroupName)
        .post(loginChecker, groupController.createGroup)    

    app.route("/users/groups/:groupId")
        .get(loginChecker, groupController.getGroupInfo) 
        .post(loginChecker, groupController.addOrRemoveUserToGroup)

    /* ----------------------------------------------- */

    app.route('/user/event/subscribed')
        .get(loginChecker, userController.getUserSubscribedEvents)
    
    app.route("/users/search/:name")
        .get(userController.searchUser)
    
    app.route('/users/friendposition')
        .post(loginChecker, userController.requestFriendPosition)

    app.route('/users/friendship')
        .post(loginChecker, userController.userFriendRequest)
        .delete(loginChecker, userController.removeLinkedUser)

    app.route('/users/follower')
        .post(loginChecker, userController.addFollower)

    app.route("/users/:uuid/info")
        .get(userController.getLightweightInfoUser)

    app.route("/users/:uuid/badges/progress")
        .get(userController.getUserProgress)
    
    app.route("/users/:uuid")
        .get(userController.getInfoUser)

    app.route('/notifications')
        .post(loginChecker, notificationController.markNotificationAsRead)
    
    app.route('/notifications/:fromIndex')
        .get(loginChecker, notificationController.getNotification)

    app.route("/notification/friendship")
        .post(loginChecker,userController.friendshipAnswer)

    app.route("/notification/friendposition")
        .post(loginChecker, userController.responseFriendPosition)

    app.route("/profile")
        .put(
            loginChecker,
            upload.single("avatar"),
            userController.updateProfile
        )

    app.route("/profile/credentials")
        .put(userController.updateCredentials)
    
    app.route('/invite')
        .post(loginChecker, userController.inviteFriends)

    /* ----------------------------------------------- */

    app.route("/registration")
        .post(
            upload.single("avatar"),
            loginController.registration
        )

    app.route('/login')
        .get(loginController.getLogin)
        .post(loginController.login)
        
    app.route('/logout')
        .post(loginChecker, loginController.logout)

    /* ----------------------------------------------- */

    app.route('/events/info/:uuid/reviews')
        .get(reviewController.getEventReviews)
        .post(loginChecker, reviewController.newReview)

    app.route('/users/:uuid/myReviews')
        .get(reviewController.getUserReviewsDone)

    app.route('/users/:uuid/receivedReviews')
        .get(reviewController.getUserReviewsReceived)

}
