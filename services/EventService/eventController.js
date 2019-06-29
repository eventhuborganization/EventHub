class EventController{
    constructor() {
    }

    getEvent(id = null) {
        if(id === null){
            //retrunt all event
        } else {
            //return event with specify id;
        }
    }

    getEventByCreator(creator) {
        //Return all event organizated by creator
    }

    getEventByTipology(tipology = "") {
        if(tipology === ""){
            //retrunt all event
        } else {
            //return typology specified events;
        }
    }

    newEvent(eventName, eventDescription = "", eventCreator, visibility = "Private", typology, subtypology, data, hours, position){
        //Inserire nel database in nuovo evento.
    }
}

export default EventController;