const httpsClient = require('https')

class EventService {
    constructor(host, port){
        // this. user = user
        // this.password = password
        this.host = host
        this.port = port
        this.hostport = host + ":" + port

    }

    getEvent(fun){
        httpsClient.get(`${this.host}/event/id/${id}`, fun)
    }

    getEventById(id,fun){
        if(id){
            httpsClient.get(`${this.host}/event/id/${id}`, fun)
        }
    }

    getEventByCreator(creator, fun){
        if(creator){
            httpsClient.get(`${this.host}/event/creator/${creator}`, fun)
        }
    }

    getEventByCreator(tipology, fun){
        if(tipology){
            httpsClient.get(`${this.host}/event/creator/${tipology}`, fun)
        }
    }

    createNewEvent(event, fun){
        const option = {  hostname: host,
            port: port,
            path: '/event/new',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': event.length
            }
        }
        
        let postRequest = httpsClient.request(option, fun);
        postRequest.write(event);
    }
}



exports.createBasicEventJSON = (name, description, organizator, eventData, location, public, tipology, numberOfParticipant) => {
    return `{
        "event": {
            "name": "${name}",
            "description": "${description}",
            "organizator": "${organizator}",
            "eventData": "${eventData}",
            "location": ${location},
            "public": "${public}",
            "tipology": ${tipology},
            "maximumParticipant": ${numberOfParticipant}
        }
    }`
}