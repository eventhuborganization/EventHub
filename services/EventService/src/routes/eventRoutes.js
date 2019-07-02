module.exports = function(app) {
    var eventController = require("../controllers/eventController")
    
    app.get("/event/getById/:id", eventController.getEvent)
    
    app.get("/event/getByTipology/:tipology", eventController.getEventByTipology)
    
    app.get("/event/getByCreator/:creator", eventController.getEventByCreator)
    
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