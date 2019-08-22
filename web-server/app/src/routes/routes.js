module.exports = (app) => {    
    var eventController = require('../controllers/EventController')
    var userController = require('../controllers/UserController')
    var notificationController = require('../controllers/NotificationController')
    var loginController = require('../controllers/LoginController')
    const {loginChecker} = require('../API/passport')
    var multer = require('multer')

    const upload = multer({
        dest: __dirname + "../../../temp/files"
    });

    app.route("/")
        .get(loginChecker,(req, res) => {
            res.sendFile(`${appRoot}/views/home.html`)
        })

    app.route('/images/:name')
        .get((req, res) => {
            res.sendFile(`${appRoot}/public/images/events/${req.params.name}`)
        })

    app.route('/avatars/:name')
        .get((req, res) => {
            res.sendFile(`${appRoot}/public/images/users/${req.params.name}`)
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

    app.route('/events/position/near')
        .get(eventController.getEventsNear)

    app.route('/events/search/:name')
        .get(eventController.searchEventByName)

    app.route("/events/:fromIndex")
        .get(eventController.getEventsFromIndex)

    app.route('/user/event')
        .post(loginChecker, eventController.addUserToEvent)

    /* ----------------------------------------------- */

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
    
    app.route("/users/:uuid")
        .get(userController.getInfoUser)

    app.route('/notifications')
        .post(loginChecker, notificationController.markNotificationAsReaded)
    
    app.route('/notifications/:fromIndex')
        .get(loginChecker, notificationController.getNotification)

    app.route("/notification/friendship")
        .post(loginChecker,userController.friendshipAnswer)

    app.route("/notification/friendposition")
        .post(loginChecker, userController.responseFriendPosition)

    app.route("/profile")
        .put(loginChecker, userController.updateProfile)

    app.route("/profile/credentials")
        .put(userController.updateCredentials)

    app.route('/invite/:uuid')
        .get(loginChecker, userController.inviteFriends)

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
}