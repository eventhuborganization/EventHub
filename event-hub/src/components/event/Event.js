import React from 'react'
import Axios from 'axios'
import { LoginRedirect } from '../redirect/Redirect';
import './Event.css'

let participate = (server, eventId, onError) => {
    interactWithEvent(
        server,
        {participant: true, event: eventId},
        () => onError("Errore durante la partecipazione ad un evento. Riprovare.")
    )
}

let follow = (server, eventId, onError) => {
    interactWithEvent(
        server,
        {follower: true, event: eventId},
        () => onError("Errore nel tentativo di seguire ad un evento. Riprovare.")
    )
}

let interactWithEvent = (server, message, onError) => {
    Axios.post(server + "/events", message)
        .catch(error => onError())
        .then(response => {
            let status = (response ? response.status : null)
            if (status !== 200) {
                onError()
            }
        })
}

let PARTY = "party"
let SPORT = "sport"
let MEETING = "meeting"
let FOLLOW = 0
let PARTICIPATE = 1

let getButtonClassName = (eventType, buttonType) => {
    var buttonClass = ""
    switch(buttonType) {
        case FOLLOW:
            buttonClass = "Secondary"
            break
        case PARTICIPATE:
            buttonClass = "Primary"
            break
        default: break
    }
    if (eventType === PARTY)
        return "btn partyButton partyButton" + buttonClass + " ml-2"
    else if (eventType === MEETING)
        return "btn meetingButton meetingButton" + buttonClass + " ml-2"
    else if (eventType === SPORT)
        return "btn sportButton sportButton" + buttonClass + " ml-2"
}

let FollowButton = (props) => {

    let loginRedirect = undefined

    let onClick = () => {
        if (loginRedirect)
            loginRedirect.doIfLoggedOrElseRedirect(() => follow(props.mainServer, props.event._id, props.onError))
    }

    return (
        <button className={getButtonClassName(props.event.typology, FOLLOW)}
                onClick={onClick}>
            {<LoginRedirect {...props} onRef={ref => loginRedirect = ref}/>}
            Segui
        </button>
    )
}

let ParticipateButton = (props) => {

    let loginRedirect = undefined

    let onClick = () => {
        if (loginRedirect)
            loginRedirect.doIfLoggedOrElseRedirect(() => participate(props.mainServer, props.event._id, props.onError))
    }

    return (
        <button className={getButtonClassName(props.event.typology, PARTICIPATE)}
                onClick={onClick}>
            {<LoginRedirect {...props} onRef={ref => loginRedirect = ref}/>}
            Partecipa
        </button>
    )
}

let EventBadge = (props) => {
    var typeClass = ""
    var label = ""
    if (props.event.typology === PARTY) {
        typeClass = "party partyBadge"
        label = "Festa"
    } else if (props.event.typology === MEETING) {
        typeClass = "meeting meetingBadge"
        label = "Incontro"
    }
    else if (props.event.typology === SPORT) {
        typeClass = "sport sportBadge"
        label = "Sport"
    }
    return (<div className={"badge badge-pill " + typeClass}>#{label}</div>)
}

let EventInteractionPanel = (props) => {
    return (
        <div className="row">
            <div className="col-3 my-auto">
                <EventBadge {...props}
                            key={props.event._id + "badge"}
                            event={props.event} />
            </div>
            <div className="col-9 d-flex justify-content-end">
                <FollowButton {...props}
                              key={props.event._id + "followbutton"}
                              event={props.event} />
                <ParticipateButton {...props}
                                   key={props.event._id + "participatebutton"}
                                   event={props.event} />
            </div>
        </div>
    )
}

export {FollowButton, ParticipateButton, EventBadge, EventInteractionPanel, PARTY, SPORT, MEETING}