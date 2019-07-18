module.exports = (app) => {    
    var controllerA = require("../controllers/controller_a.js");
    var controllerB = require("../controllers/controller_b.js");
    app.route("/")
        .get(sessionChecker,controllerA.getHome);

    app.route("/events/:fromIndex")
        .get(controllerA.getEvents)

    app.route("/notification/friendship")
        .post(sessionChecker,controllerA.friendshipAnswer);

    app.route("/notification/friendposition")
        .post(sessionChecker, controllerA.getFriendPosition);

    app.route("/registration")
        .post(controllerA.registration);

    app.route("/profile")
        .put(sessionChecker, controllerA.updateProfile);

    app.route("/event")
        .put(sessionChecker, controllerA.createEvent);

    app.route("/profile/credentiels")
        .put(controllerA.updateCredentials);

    app.route("/user/:uuid")
        .get(controllerA.getInfoUser);

    app.route("/user/search/:name")
        .get(controllerA.searchUser);

// *-------------------------------------------------------------------------

    app.route('/login')
        .get(controllerB.getLogin) //ritronare la pagina di login
        .post(controllerB.login)
        
    app.route('/logout')
        .get(sessionChecker, controllerB.logout)

    app.route('/user/event')
        .post(sessionChecker, controllerB.addEventUser)

    app.route('/events/info/:uuid')
        .get(sessionChecker, controllerB.eventInfo)

    app.route('/events/search/:name')
        .get(sessionChecker, controllerB.searchEventByName)

    app.route('/users/friendship')
        .post(sessionChecker, controllerB.userFriendRequest)

    app.route('/notification')
        .post(sessionChecker, controllerB.markNotificationAsReaded)
    
    app.route('/notification/:fromIndex')
        .post(sessionChecker, controllerB.getNotification)
}