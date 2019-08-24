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
    location: {
        city: {type: String},
        geo:{
            type: {
                type: String,
                enum: ['Point'], 
                required: true,
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    public:{
        type: Boolean,
        default: false
    },
    typology:{
        type: {name: String},
        required: 'A typology is required'
    },
    participants: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    followers: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    thumbnail: String,
    maximumParticipants: {
        type: Number, 
        min: 0,
        required: 'A maximum number of participant is required'
    },
    reviews: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    creationDate:{
        type: Date,
        default: Date.now
    }
})
//Dichiaro a mongoDb di indicizare le posizioni come 2dsphere
EventSchema.index({ 'location.geo': '2dsphere' });
module.exports = mongoose.model('Events', EventSchema);