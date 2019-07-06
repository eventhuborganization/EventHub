module.exports = function(app) {
    var controller = require("../controllers/controller");

    app.route("/users")
        .post();

    app.route("/users/:uuid")
        .get()
        .put()
        .delete();

    app.route("/users/credentials")
        .post()
        .put();

    app.route("/users/:uuid/notifications/:fromIndex")
        .get();

    app.route("/users/:uuid/notifications")
        .post();

    app.route("/users/linkedUsers")
        .post()
        .delete();

    app.route("/users/:uuid/levels")
        .get();

    app.route("/users/:uuid/events")
        .get()
        .post()
        .delete();

    app.route("/users/:uuid/reviews/written")
        .get()
        .post()
        .delete();

    app.route("/users/:uuid/reviews/received")
        .get();

    app.route("/users/:uuid/actions")
        .get()
        .post();

    /*/users/:uuid
    - GET => tutte le info dell'utente [Return: 200 | 404]
    - PUT => Aggiornamento utente by json [Return: 200 | 400 | 404]
    - DELETE => elimina utente => dopo contatta event ed elimina l'utente da tutti gli eventi in cui è registrato [Return: 200 | 400]

    - /users/credentials
    - (login) POST => JSON email, password [Return: 200 | 404]
    - (cambio info) PUT => JSON email, newEmail(?), pwd, newPwd(?) [Return: 200 | 400 | 404]

    - /users (creazione utente)
    - POST => JSON tutte le info [Return: 200 | 400]

    - /users/:uuid/notifications/:fromIndex (default 5 notifiche per volta)
    - GET => ritorna tutte le notifiche che fanno match [Return: 200 | 404]

    - /users/:uuid/notifications
    - POST => JSON tutte le info [Return: 200 | 400 | 404]

    - /users/linkedUsers
    - POST => JSON uuid1, uuid2 [Return: 200 | 400]
    - DELETE => JSON uuid1, uuid2 [Return: 200 | 400]

    - /users/:uuid/linkedUsers
    - GET => ritorna utenti collegati (amici e follower) [Return: 200 | 404]

    - /users/:uuid/levels
    - GET => ritorna badge dell'utente (JSON --> badge, points) [Return: 200 | 404]

    - /users/:uuid/events
    - GET => ritorna eventi dell'utente [Return: 200 | 404]
    - POST => aggiunge UUID a partecipa/followa {partecipant(?): uuid, follower(?): uuid} [Return: 200 | 400 | 404]
    - DELETE => toglie UUID a partecipa/followa [Return: 200 | 404]

    - /users/:uuid/reviews/written
    - GET  => ritorna le recensione scritta [Return: 200 | 404]
    - POST => aggiunge la recensione scritta [Return: 200 | 400 | 404]
    - DELETE  => Cancella la recensione  [Return: 200 | 404]

    - /users/:uuid/reviews/received
    - GET  => ritorna le recensione ricevute [Return: 200 | 404]

    - /users/:uuid/actions
    - GET => ritorna lista azioni dell'utente [Return: 200 | 404]
    - POST => Aggiunge una azione [Return: 200 | 400 | 404]*/
}