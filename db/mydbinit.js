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
db.users.insertOne({
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
db.users.insertOne({
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
let organizatorId = db.users.insertOne({
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
}).insertedId;

db.events.insertOne({
    "creationDate": new Date("Sat Jul 27 2019 18:47:41 GMT+0200 (Ora legale dell’Europa centrale)"),
    "eventDate": new Date("Sat Aug 24 2019 18:47:41 GMT+0200 (Ora legale dell’Europa centrale)"),
    "description": "Una madonna rogoronnesca",
    "followers": [],
    "maximumParticipants": 200,
    "name": "Evento della madonna",
    "organizator": organizatorId,
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

let actionsId = []

actionsId.push(db.actions.insertOne({
    'typology': 1,
    'points': 5,
    'desc_it': 'Scrittura di una recensione'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 2,
    'points': 5,
    'desc_it': 'Partecipazione ad un evento'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 3,
    'points': 5,
    'desc_it': 'Creazione di un evento'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 4,
    'points': 5,
    'desc_it': 'Recensioni al proprio evento positive'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 5,
    'points': -5,
    'desc_it': 'Recensioni al proprio evento negative'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 6,
    'points': 5,
    'desc_it': 'Invitare un amico ad un evento'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 7,
    'points': 5,
    'desc_it': 'Invitare un gruppo ad un evento'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 8,
    'points': 5,
    'desc_it': 'Condivisione della posizione'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 9,
    'points': 5,
    'desc_it': 'Nuova amicizia o follow'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 10,
    'points': -5,
    'desc_it': 'Rimozione di un amico o follow'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 11,
    'points': 5,
    'desc_it': 'Aggiunto utente ad un gruppo'
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 12,
    'points': 5,
    'desc_it': "Punti all'organizzatore di un evento in base al numero di partecipanti"
}).insertedId)

actionsId.push(db.actions.insertOne({
    'typology': 13,
    'points': 0,
    'desc_it': "Richiedi la posizione"
}).insertedId)

db.badges.insertOne({
    'name': "Ti troverò",
    'icon': 'findYou.svg',
    'desc_it': "Condividi la tua posizione 3 volte",
    'requirements': [
        {
            'action': actionsId[7],
            'quantity': 3
        }
    ]
})

db.badges.insertOne({
    'name': "L'attivo",
    'icon': 'inviter.svg',
    'desc_it': "Invita per la prima volta un amico ad un evento",
    'requirements': [
        {
            'action': actionsId[5],
            'quantity': 1
        }
    ]
})

db.badges.insertOne({
    'name': "L'organizzatore",
    'icon': 'parties.svg',
    'desc_it': "Crea 5 eventi",
    'requirements': [
        {
            'action': actionsId[2],
            'quantity': 5
        }
    ]
})

db.badges.insertOne({
    'name': "Il sociale",
    'icon': 'friends.svg',
    'desc_it': "Fai amici o segui un totale di 4 profili",
    'requirements': [
        {
            'action': actionsId[8],
            'quantity': 4
        }
    ]
})

db.badges.insertOne({
    'name': "Lo stalker",
    'icon': 'stalker.svg',
    'desc_it': "Richiedi la posizione a una o più persone 3 volte",
    'requirements': [
        {
            'action': actionsId[12],
            'quantity': 3
        }
    ]
})