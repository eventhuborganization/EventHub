const axios = require('axios')

exports.EventService = class EventService{
    constructor(host, port){
        // this. user = user
        // this.password = password
        this.host = host
        this.port = port
        this.hostport = 'http://' + host + ':' + port

    }

    /**
     * Restituisce una lista di eventi che metchano con la stringa
     * 
     * @param {String} name stringa di ricerca
     * @param {Object} query dati di filtraggio
     * @param {Function} successCallback da eseguire in caso di successo
     * @param {Function} errorCallback da eseguire in caso di errore
     */
    searchEvent(name, query, successCallback = null, errorCallback = null) {
        axios.get(`${this.hostport}/events/search/${name}`, {params: query})
        .then(successCallback)
        .catch(errorCallback);
    }

    /**
     * Ritorna gli eventi filtrati con i valori dell'oggetto query.
     * 
     * Codici di ritorno:
     *  - 201: tutto bene risultati presenti
     *  - 204: tutto bene ma risultati non esistenti
     *  - 404: errore nella query
     * 
     * @param {Object} query dell'evento da selezionare. 
     * @param {Function} successCallback da eseguire in caso di successo
     * @param {Function} errorCallback da eseguire in caso di errore
     */
    getEvent(query, successCallback = null, errorCallback = null){
        axios.get(`${this.hostport}/events`, { params: query })
        .then(successCallback)
        .catch(errorCallback);
    }

    /**
     * Ritorna l'evento con id uuid.
     * 
     * Codici di ritorno:
     *  - 201: tutto bene risultati presenti
     *  - 204: tutto bene ma risultati non esistenti
     *  - 404: errore nella query
     * 
     * @param {ObjectId} eventUuid dell'evento da selezionare.
     * @param {Function} successCallback da eseguire in caso di successo
     * @param {Function} errorCallback da eseguire in caso di errore
     */
    getEventById(eventUuid,  successCallback = null, errorCallback = null){
        axios.get(`${this.hostport}/events/${eventUuid}`)
        .then(successCallback)
        .catch(errorCallback);
    }

    /**
     * Ritorna tutte le reviews dell'evento identificato con uuid.
     * 
     * Codici di ritorno:
     *  - 201: tutto bene risultati presenti
     *  - 204: tutto bene ma risultati non esistenti
     *  - 404: errore nella query
     * 
     * @param {ObjectId} eventUuid uuid dell'evento.
     * @param {Function} successCallback da eseguire in caso di successo
     * @param {Function} errorCallback da eseguire in caso di errore
     */
    getEventReviews(eventUuid,  successCallback = null, errorCallback = null){
        axios.get(`${this.hostport}/events/${eventUuid}/reviews`)
        .then(successCallback)
        .catch(errorCallback);
    }

    /**
     * Aggiunge una recensione all'evento
     * Codici di ritorno:
     * 
     *  - 200: dato aggiunto correttamente
     *  - 400: errore nell'inserimento
     * 
     * @param {ObjectId} eventUuid uuid dell'evento.
     * @param {ObjectId} reviewsUuid uuid della recensione da aggiungere.
     * @param {Function} successCallback da eseguire in caso di successo
     * @param {Function} errorCallback da eseguire in caso di errore
     */
    addEventReviews(eventUuid, reviewsUuid,  successCallback = null, errorCallback = null){
        let data = JSON.stringify({reviews:{reviews: [reviewsUuid]}})
        axios.post(`${this.hostport}/events/${eventUuid}/reviews`, data)
        .then(successCallback)
        .catch(errorCallback);
    }

    /**
     * Aggiorna l'evento con i dati presenti in dataToUpdate.
     *
     *  - 200: dato aggiunto correttamente
     *  - 400: errore nell'inserimento
     *
     * @param {ObjectId} eventUuid uuid dell'evento che si vuole assegnare l'aggiunta delle persone.
     * @param {Object} dataToUpdate oggetto con dento i valori da assegnare per aggiornare l'evento. L'oggetto
     * deve avere la seguiente struttura {event : {name: '', location:{}, etc...}}.
     * @param {Function} successCallback da eseguire in caso di successo
     * @param {Function} errorCallback da eseguire in caso di errore
     */
    updateEventById(eventUuid, dataToUpdate,  successCallback = null, errorCallback = null){
        let data = JSON.stringify(dataToUpdate)

        axios.put(`${this.hostport}/events/${eventUuid}`, data)
        .then(successCallback)
        .catch(errorCallback);
    }

    
    /**
     * Aggiunge gli utenti indicati nell'oggetto users all'evento indicato nella variabile eventUuid.
     * 
     *  - 200: dato aggiunto correttamente
     *  - 400: errore nell'inserimento
     * 
     * @param {ObjectId} eventUuid uuid dell'evento che si vuole assegnare l'aggiunta delle persone.
     * @param {Object} users oggetto con dento i valori da assegnare per aggiornare l'evento. L'oggetto
     * deve avere la seguiente struttura {user : {participants: value, followers: value}}.
     * @param {Function} successCallback da eseguire in caso di successo
     * @param {Function} errorCallback da eseguire in caso di errore
     */
    addUserToEvent(eventUuid, users,  successCallback = null, errorCallback = null){
        axios.post(`${this.hostport}/events/${eventUuid}/users`, users)
        .then(res => {
            let userId = (users.user.followers ? users.user.followers : users.user.participants)
            let data = {}
            if(users.user.followers) {
                data.follower = eventUuid
            } else {
                data.participant = eventUuid
            }
            return axios.post(`${UserServiceServer}/users/${userId}/events`, data)
                    .then(() => Promise.resolve(res))
            
        })
        .then(successCallback)
        .catch(errorCallback);
    }

    /**
     * rimuove gli utenti indicati nell'oggetto users all'evento indicato nella variabile eventUuid.
     * 
     *  - 200: dato aggiunto correttamente
     *  - 400: errore nell'inserimento
     * 
     * @param {ObjectId} eventUuid uuid dell'evento a cui si vogliono eliminare gli utenti
     * @param {Object} users oggetto con dento i valori da assegnare per aggiornare l'evento. L'oggetto
     * deve avere la seguiente struttura {user : {participants: value, followers: value}}.
     * @param {Function} successCallback da eseguire in caso di successo
     * @param {Function} errorCallback da eseguire in caso di errore
     */
    removeUserToEvent(eventUuid, users, successCallback = null, errorCallback = null){
        axios.delete(`${this.hostport}/events/${eventUuid}/users`, {data: eventUuid})
        .then(successCallback)
        .catch(errorCallback);
    }

    /**
     * Inserisce un nuovo evento del db.
     * 
     *  - 201: dato aggiunto correttamente
     *  - 400: errore nell'inserimento
     * 
     * @param {Object} event da aggiungere nel db.
     * @param {Function} successCallback da eseguire in caso di successo
     * @param {Function} errorCallback da eseguire in caso di errore
     */
    newEvent(event, successCallback = null, errorCallback = null){
        axios.post(`${this.hostport}/events`, {event: event})
        .then(successCallback)
        .catch(errorCallback);
    }

    /**
     * Eliminare un evento del db.
     * 
     *  - 200: dato eliminato correttamente
     *  - 400: errore nell'inserimento
     * 
     * @param {Object} eventUuid id dell'evento da eliminare dal db.
     * @param {Function} successCallback da eseguire in caso di successo
     * @param {Function} errorCallback da eseguire in caso di errore
     */
    deleteEvent(eventUuid, successCallback = null, errorCallback = null){
        axios.delete(`${this.hostport}/events/${eventUuid}`)
        .then(successCallback)
        .catch(errorCallback);
    }
}

/**
 * per usare quest proprietà usare la seguente linea di codice:
 * 
 *  let event = Object.assign({}, moduleImported.Event);
 * 
 * questo permette di avere una copia correttamente modificabile dell'oggetto,
 * lascianto quello origianle con i valori di default.
 * 
 * ! Trovare una soluzione più elegante
 */
exports.Event = {
    event:{
        name: '',
        description: '',
        organizator: '',
        eventDate: Date.now(),
        location: {maps:'', coordinate:{lat: 0, long: 0}},
        public: false,
        typology: {name:'', subtypology:''},
        maximumParticipants:0,
        participants: [],
        followers:[],
        thumbnail: '',
        reviews: [],
    }
}

/**
 * Esempio di callback per debug e per vedere un po' come funziona.
 * 
 * @param res dati restituiti della request http del modulo nodejs.
 */
exports.defaultCallback = (res) => {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
}