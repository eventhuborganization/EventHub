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
    organizator:{
        type: Schema.Types.ObjectId,
        required: 'A creator is required'
    },
    eventDate:{
        type: Date,
        required: 'A date is required'
    },
    location:{
        type: {latitude: String, longitude: String},
        required: 'A location is required'
    },
    public:{
        type: Boolean,
        default: false
    },
    tipology:{
        type: {name: String, subtipology: String},
        required: 'A tipology is required'
    },
    participants: [Schema.Types.ObjectId],
    followers: [Schema.Types.ObjectId],
    thumbnail: [String],
    maximumParticipants: {
        type: Number, 
        min: 0,
        required: 'A maximum number of participant is required'
    },
    reviews: [Schema.Types.ObjectId],
    creationDate:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Events', EventSchema);