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
    .get(eventController.getEventByCreator)
    .put()
    .delete()

    // app.route('/movies/:id')
    // .get(moviesController.read_movie)
    // .put(moviesController.update_movie)
    // .delete(moviesController.delete_movie);

    // app.post("/event/new", (req,res) => {
    //     if(req.body.event.name &&
    //         req.body.even.description &&
    //         req.body.even.creator &&
    //         req.body.even.visibility &&
    //         req.body.event.typology &&
    //         req.body.even.subtypology &&
    //         req.body.even.data &&
    //         req.body.even.hours &&
    //         req.body.even.position){
    
    //     newEvent(req.body.event.name,
    //         req.body.even.description,
    //         req.body.even.creator,
    //         req.body.even.visibility,
    //         req.body.event.typology,
    //         req.body.even.subtypology,
    //         req.body.even.data,
    //         req.body.even.hours,
    //         req.body.even.position)
    
    //         console.log(`[NEW EVENT] | Name: ${req.body.event.name}!`)
    //         res.status(200).end();
    //     }
    // })
}