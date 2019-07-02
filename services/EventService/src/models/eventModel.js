var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    name:{
        type: String,
        required: 'A name is required'
    },
    description:{
        type: String
    },
    creator:{
        type: String,
        required: 'A creator is required'
    },
    visibility:{
        type: String,
        default: 'Private'
    },
    tipology:{
        type: String,
        required: 'A tipology is required'
    },
    subtipology:{
        type: String,
        required: 'A subtipology is required'
    },
    eventData:{
        type: Date
    },
    creationData:{
        type: Date,
        default: Date.now
    }
})

//Query che seleziona gli eventi di un dato creatore
EventSchema.query.byCreator = (creatorName)=>{
    return this.where({creator: creatorName})
}
//Query che seleziona gli eventi di una data tipologia
EventSchema.query.byTipology = (tipologyName)=>{
    return this.where({tipology: tipologyName})
}
module.exports = mongoose.model('Events', EventSchema);