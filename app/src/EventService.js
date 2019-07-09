const httpsClient = require('http')

exports.EventService = class EventService{
    constructor(host, port){
        // this. user = user
        // this.password = password
        this.host = host
        this.port = port
        this.hostport = 'http://' + host + ':' + port

    }

    /**
     * Ritorna gli eventi filtrati con i valori dell'oggetto query.
     * 
     * query = '?eventProperty=property&eventProperty2=property2' 
     * 
     * Codici di ritorno:
     *  - 201: tutto bene risultati presenti
     *  - 204: tutto bene ma risultati non esistenti
     *  - 404: errore nella query
     * 
     * @param {Object} query dell'evento da selezionare. 
     * @param {Function} callback viene assegnata alla funzione request del modulo 'https' di nodejs.
     */
    getEvent(query = "", callback = null){
        //let requestData = JSON.stringify(query)
        httpsClient.get(`${this.hostport}/events`+ query, callback)
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
     * @param {Function} callback viene assegnata alla funzione request del modulo 'https' di nodejs.
     */
    getEventById(eventUuid, callback = null){
        httpsClient.get(`${this.hostport}/events/${eventUuid}`, callback)
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
     * @param {Function} callback viene assegnata alla funzione request del modulo 'https' di nodejs.
     */
    getEventReviews(eventUuid, callback = null){
        httpsClient.get(`${this.hostport}/events/${eventUuid}/reviews`, callback)
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
     * @param {Function} callback viene assegnata alla funzione request del modulo 'https' di nodejs.
     */
    addEventReviews(eventUuid, reviewsUuid, callback = null){
        let data = JSON.stringify({reviews: reviewsUuid})
        const option = {  
            hostname: this.host,
            port: this.port,
            path: `/events/${eventUuid}/reviews`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
        let postRequest = httpsClient.request(option, callback)
        postRequest.write(data)
        postRequest.end()
    }

    /**
     * Aggiorna l'evento con i dati presenti in dataToUpdate.
     *
     *  - 200: dato aggiunto correttamente
     *  - 400: errore nell'inserimento
     *
     *  @param {ObjectId} eventUuid uuid dell'evento che si vuole assegnare l'aggiunta delle persone.
     * @param {Object} dataToUpdate oggetto con dento i valori da assegnare per aggiornare l'evento. L'oggetto
     * deve avere la seguiente struttura {event : {name: '', location:{}, etc...}}.
     * @param {Function} callback viene assegnata alla funzione request del modulo 'https' di nodejs.
     */
    updateEventById(eventUuid, dataToUpdate, callback = null){
        let data = JSON.stringify(dataToUpdate)
        const option = {  
            hostname: this.host,
            port: this.port,
            path: `/events/${eventUuid}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
        let postRequest = httpsClient.request(option, callback)
        postRequest.write(data)
        postRequest.end()
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
     * @param {Function} callback viene assegnata alla funzione request del modulo 'https' di nodejs.
     */
    addUserToEvent(eventUuid, users, callback = null){
        let data = JSON.stringify(users)
        const option = {  
            hostname: this.host,
            port: this.port,
            path: `/events/${eventUuid}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
        let postRequest = httpsClient.request(option, callback)
        postRequest.write(data)
        postRequest.end()
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
     * @param {Function} callback viene assegnata alla funzione request del modulo 'https' di nodejs.
     */
    removeUserToEvent(eventUuid, users, callback = null){
        data = JSON.stringify(users)
        const option = {  
            hostname: this.host,
            port: this.port,
            path: `/events/${eventUuid}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
        let postRequest = httpsClient.request(option, callback)
        postRequest.write(data)
        postRequest.end()
    }

    /**
     * Inserisce un nuovo evento del db.
     * 
     *  - 201: dato aggiunto correttamente
     *  - 400: errore nell'inserimento
     * 
     * @param {Object} event da aggiungere nel db.
     * @param {Function} callback viene assegnata alla funzione request del modulo 'https' di nodejs.
     */
    newEvent(event, callback){
        let data = JSON.stringify(event)
        const option = {  
            hostname: this.host,
            port: this.port,
            path: '/events',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
        
        let postRequest = httpsClient.request(option, callback)
        postRequest.write(data)
        postRequest.end()
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
        tipology: {name:'', subtipology:''},
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