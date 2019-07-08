module.exports = function(app) {
    var eventController = require("../controllers/eventController")

    app.route("/events")
    .get(eventController.getEvent)
    .post(eventController.newEvent)

    app.route("/events/:uuid")
    .get(eventController.getEventById)
    .put(eventController.updateEventById)

    app.route("/events/:uuid/users")
    .post(eventController.addUserToEvent) //ritorna i partecipanti o i follower di un evento
    .delete(eventController.removeUserToEvent) //cancella utente e o utenti dalle partecipazioni/following

    app.route("/events/:uuid/reviews")//selezione evento per creatore
    .get(eventController.getEventReviews) //ottieni 
    .post(eventController.addEventReviews) //nuova recensione
    
}