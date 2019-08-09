module.exports = (app) => {    
    var eventController = require('../controllers/EventController')
    var userController = require('../controllers/UserController')
    var notificationController = require('../controllers/NotificationController')
    var loginController = require('../controllers/LoginController')

    app.route("/")
        .get(sessionChecker,(req, res) => {
            res.sendFile(`${appRoot}/views/home.html`);
        });
    
        app.route('/images/:name')
    .get((req, res) => {
        res.sendFile(`${appRoot}/public/images/events/${req.params.name}`);
    })

    app.route('/avatars/:name')
    .get((req, res) => {
        res.sendFile(`${appRoot}/public/images/users/${req.params.name}`);
    })


    app.route("/events/:fromIndex")
        .get(eventController.getEvents)

    app.route("/notification/friendship")
        .post(sessionChecker,userController.friendshipAnswer);

    app.route("/notification/friendposition")
        .post(sessionChecker, userController.responseFriendPosition);

    app.route("/registration")
        .post(loginController.registration);

    app.route("/profile")
        .put(sessionChecker, userController.updateProfile);

    app.route("/events")
        .put(sessionChecker, eventController.createEvent);

    app.route("/profile/credentiels")
        .put(userController.updateCredentials);

    app.route("/users/:uuid")
        .get(userController.getInfoUser);

    app.route("/users/search/:name")
        .get(userController.searchUser);

// *-------------------------------------------------------------------------

    app.route('/login')
        .get(loginController.getLogin)
        .post(loginController.login)
        
    app.route('/logout')
        .get(sessionChecker, loginController.logout)

    app.route('/user/event')
        .post(sessionChecker, eventController.addUserToEvent)

    app.route('/events/info/:uuid')
        .get(sessionChecker, eventController.eventInfo)

    app.route('/events/position/near')
        .get(sessionChecker, eventController.getEventsNear)

    app.route('/events/search/:name')
        .get(sessionChecker, eventController.searchEventByName)

    app.route('/users/friendship')
        .post(sessionChecker, userController.userFriendRequest)
        .delete(sessionChecker, userController.removeLinkedUser)

    app.route('/notifications')
        .post(sessionChecker, notificationController.markNotificationAsReaded)
    
    app.route('/notifications/:fromIndex')
        .post(sessionChecker, notificationController.getNotification)
    
    // ! notifica livello 4
    app.route('/users/friendposition')
        .post(sessionChecker, userController.requestFriendPosition);
        
    // ! Notifica livello 0 
    app.route('/invite/:uuid')
        .get(sessionChecker, userController.inviteFriends)

}