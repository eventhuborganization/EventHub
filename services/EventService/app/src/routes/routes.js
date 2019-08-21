module.exports = function(app) {
    var eventController = require("../controllers/eventController")

    app.route('/events')
        .get(eventController.getEvent)
        .post(eventController.newEvent)

    app.route('/events/search/:data')
        .get(eventController.searchEvent)

    app.route('/events/:uuid/users')
        .post(eventController.addUserToEvent)
        .delete(eventController.removeUserToEvent)

    app.route('/events/:uuid/reviews')
        .get(eventController.getEventReviews)
        .post(eventController.addEventReviews)

    app.route('/events/:uuid')
        .get(eventController.getEventById)
        .put(eventController.updateEventById)
}