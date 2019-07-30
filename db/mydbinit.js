var conn = new Mongo();
var db = conn.getDB('event-hub-db');

// create the collections leaving the original versions if already exist
db.createCollection('events', function(err, collection) {});
db.createCollection('users', function(err, collection) {});
db.createCollection('groups', function(err, collection) {});
db.createCollection('reviews', function(err, collection) {});
db.createCollection('badges', function(err, collection) {});
db.createCollection('actions', function(err, collection) {});

try {
   db.events.deleteMany({});
   db.users.deleteMany({});
   db.groups.deleteMany({});
   db.reviews.deleteMany({});
   db.badges.deleteMany({});
   db.actions.deleteMany({});
} catch (e) {
   print (e);
}

db.users.insert({
    "name": "Stefano",
    "surname": "Righini",
    "sex": "Male",
    "birthdate": "1996-10-24",
    "address": {"city": "Imola", "province": "Bologna", "address": "Via Santerno, 3"},
    "organization": false,
    "email": "stefano.righini@studio.unibo.it",
    "password": "AGDIH548csdf5DD",
    "salt": "pepe"
});

db.users.insert({
    "name": "La voglia matta",
    "address": {"city": "Imola", "province": "Bologna", "address": "Via Santerno, 3"},
    "organization": true,
    "email": "80voglia@xxx.it",
    "password": "GSBSU88",
    "salt": "pepe"
});

var uuid = db.users.find({"name": "La voglia matta"}).limit(1)[0]._id

db.events.insert({
    "name": "Evento della madonna",
    "description": "C'è la madonna in rogo (rogopedia)",
    "date": "2019-07-10",
    "organizator": uuid,
    "public": true,
    "typology": "sport",
    "maximumParticipants": 10
});
