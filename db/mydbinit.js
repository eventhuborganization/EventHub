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

/* Stefano -> password: stefano */
db.users.insert({
    "name": "Stefano",
    "surname": "Righini",
    "sex": "Male",
    "phoneNumber" : "333 444444",
    "birthdate": "1996-10-24",
    "address": {"city": "Imola"},
    "organization": false,
    "email": "stefano.righini@studio.unibo.it",
    "password": "33b0752569fbda08fdec7564d213c2c93b8df0e371f553a2ead8b574f10a2b4caf75efe981707fbc209cdc641f399141b09536ab07b8880848d85f8d7638ccf9",
    "salt": "1d7729ec4827cbe8",
    "linkedUsers" : [ ],
    "groups" : [ ],
    "eventsSubscribed" : [ ],
    "eventsFollowed" : [ ],
    "badges" : [ ],
    "points" : 0,
    "reviewsDone" : [ ],
    "reviewsReceived" : [ ],
    "notifications" : [ ],
    "actions" : [ ]
});

/* Francesco -> password: ciao */
db.users.insert({
    "name": "Francesco",
    "surname": "Grandinetti",
    "sex": "Male",
    "phoneNumber" : "3474864891",
    "birthdate": "1996-04-27",
    "address": {"city": "Imola"},
    "organization": false,
    "email": "francesco.grandinett@gmail.com",
    "password": "39364b9ad34c2e2fdd9a25743c015c9cc99d8e2953255211a3550af10cb167ebbac882099dec0fa329c2317f5050ba5dff0322630dfdecc23b08e3624f43496e",
    "salt": "1fdfa9f703c0aa51",
    "linkedUsers" : [ ],
    "groups" : [ ],
    "eventsSubscribed" : [ ],
    "eventsFollowed" : [ ],
    "badges" : [ ],
    "points" : 0,
    "reviewsDone" : [ ],
    "reviewsReceived" : [ ],
    "notifications" : [ ],
    "actions" : [ ]
});

/* La volgia matta -> password: GSBSU88*/
db.users.insert({
    "name": "La voglia matta",
    "address": {"city": "Imola", "province": "Bologna", "address": "Via Santerno, 3"},
    "organization": true,
    "email": "80voglia@xxx.it",
    "password" : "7662cfb157c0e43dfd3acaa223756a21c60a9d2a44a226f78a07854ac9c7ddd7d744ff71658a08e3b252986da7743866448fa863a3bd01fd6adba69b8099af9a",
    "phoneNumber" : "0542 684258",
    "salt" : "3c726955fcedd794",
    "linkedUsers" : [ ],
    "groups" : [ ],
    "eventsSubscribed" : [ ],
    "eventsFollowed" : [ ],
    "badges" : [ ],
    "points" : 0,
    "reviewsDone" : [ ],
    "reviewsReceived" : [ ],
    "notifications" : [ ],
    "actions" : [ ]
});

var uuid = db.users.find({"name": "La voglia matta"}).limit(1)[0]._id

db.events.insert({
    "creationDate": new Date("Sat Jul 27 2019 18:47:41 GMT+0200 (Ora legale dell’Europa centrale)"),
    "eventDate": new Date("Sat Aug 24 2019 18:47:41 GMT+0200 (Ora legale dell’Europa centrale)"),
    "description": "Una madonna rogoronnesca",
    "followers": [],
    "maximumParticipants": 200,
    "name": "Evento della madonna",
    "organizator": uuid,
    "participants": [],
    "public": true,
    "reviews": [],
    "typology": "sport",
    "location": {
        "lat": 44.345420,
        "lng": 11.725786,
        "address": "Via Santerno, 3"
    }
});

db.actions.insert({
    'typology': 1,
    'points': 5,
    'desc_it': 'Scrittura di una recensione'
})

db.actions.insert({
    'typology': 2,
    'points': 5,
    'desc_it': 'Partecipazione ad un evento'
})

db.actions.insert({
    'typology': 3,
    'points': 5,
    'desc_it': 'Creazione di un evento'
})

db.actions.insert({
    'typology': 4,
    'points': 5,
    'desc_it': 'Recensioni al proprio evento positive'
})

db.actions.insert({
    'typology': 5,
    'points': -5,
    'desc_it': 'Recensioni al proprio evento negative'
})

db.actions.insert({
    'typology': 6,
    'points': 5,
    'desc_it': 'Invitare un amico ad un evento'
})

db.actions.insert({
    'typology': 7,
    'points': 5,
    'desc_it': 'Invitare un gruppo ad un evento'
})

db.actions.insert({
    'typology': 8,
    'points': 5,
    'desc_it': 'Condivisione della posizione'
})

db.actions.insert({
    'typology': 9,
    'points': 5,
    'desc_it': 'Nuova amicizia o follow'
})

db.actions.insert({
    'typology': 10,
    'points': -5,
    'desc_it': 'Rimozione di un amico o follow'
})

db.actions.insert({
    'typology': 11,
    'points': 5,
    'desc_it': 'Aggiunto utente ad un gruppo'
})

db.actions.insert({
    'typology': 12,
    'points': 5,
    'desc_it': "Punti all'organizzatore di un evento in base al numero di partecipanti"
})