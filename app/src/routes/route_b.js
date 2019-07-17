module.exports = (app) => {
    var controller = require("../controllers/controller_b.js");
    app.route('/login')
        .get(controller.getLogin) //ritronare la pagina di login
        .post(controller.login)
        
    app.route('/logout')
        .get(sessionChecker, controller.logout)

    app.route('/events')
        .post(sessionChecker, controller.addEventUser)

    app.route('/events/info/:uuid')
        .get(sessionChecker, controller.eventInfo)

    app.route('/events/search/:name')
        .get(sessionChecker, controller.searchEventByName)

    app.route('/users/friendship')
        .post(sessionChecker, controller.userFriendRequest)

    app.route('/notification')
        .post(sessionChecker, controller.markNotificationAsReaded)
    
    app.route('/notification/:fromIndex')
        .post(sessionChecker, controller.getNotification)
}