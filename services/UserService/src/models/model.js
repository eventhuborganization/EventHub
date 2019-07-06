var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name:{
        type: String,
        required: 'A name is required'
    },
    surname:{
        type: String,
    },
    sex:{
        type: String
    },
    birthDate: Date,
    phoneNumber: String,
    address:{
        city: String,
        province: String,
        address: String,
    },
    organization:{
        type: Boolean,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    salt:{
        type: String,
        required: true
    },
    linkedUsers:{
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    groups: [Schema.Types.ObjectId],
    notifications: [{
        notTipology: Number,
        sender: Schema.Types.ObjectId,
        timestamp: Date,
        read: Boolean
    }],
    profilePicture: String,
    eventsSubscribed: [Schema.Types.ObjectId],
    eventsFollowed: [Schema.Types.ObjectId],
    badges: {
        type: [Schema.Types.ObjectId],
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    actions: {
        type: [{
            action: Schema.Types.ObjectId,
            date: Date
        }],
        required: true
    },
    reviewsDone: [Schema.Types.ObjectId],
    reviewsReceived: [Schema.Types.ObjectId]
});

var GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: {
        type: [Schema.Types.ObjectId],
        required: true
    }
});

var ReviewSchema = new Schema({
    writer: {
        type: Schema.Types.ObjectId,
        required: true
    },
    event: {
        type: Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    evaluation: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

var BadgeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    requirements: {
        type: [{
            action: Schema.Types.ObjectId,
            quantity: Number
        }],
        required: true
    }
});

var ActionSchema = new Schema({
    type: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    desc_it: {
        type: String,
        required: true
    }
});


//Query che seleziona gli eventi di un dato creatore
/*EventSchema.query.byCreator = (creatorName)=>{
    return this.where({creator: creatorName})
}
//Query che seleziona gli eventi di una data tipologia
EventSchema.query.byTipology = (tipologyName)=>{
    return this.where({tipology: tipologyName})
}*/
module.exports = mongoose.model('users', UserSchema);