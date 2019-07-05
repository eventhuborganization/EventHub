module.exports = function(app) {
    var eventController = require("../controllers/eventController")
    //app.get("/", eventController.newEvent)

    app.route("/event")
    .get(eventController.getEvent)


    app.route("/event/id/:id") //selezione evento per id
    .get(eventController.getEventById)
    .put() //Update Event
    .delete() //delete Event

    app.route("/event/tipology/:tipology")//selezione evento per tipologia
    .get(eventController.getEventByTipology)
    .put()
    .delete()

    app.route("/event/creator/:creator")//selezione evento per creatore
    .get(eventController.getEventByOrganizator)
    .put()
    .delete()
    
    app.route("/event/new")
        .post(eventController.newEvent)
}