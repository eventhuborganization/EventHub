import React from 'react'
import Axios from 'axios'
import { LoginRedirect } from '../redirect/Redirect';
import './Event.css'
import {LocationMap} from '../map/Maps'
import UserAvatar from "../user_avatar/UserAvatar";

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

/**
 *
 * @param props {
 *     event: {
 *         typology: String,
 *         name: String,
 *         date: String,
 *         time: String,
 *         address: String,
 *         numParticipants: Integer,
 *         maxParticipants: Integer
 *     }
 * }
 * @returns {*}
 * @constructor
 */
let EventHeaderBanner = props => {

    let getBannerClassName = () => {
        let type = props.event.typology
        if (type === PARTY)
            return "partyBanner"
        else if (type === MEETING)
            return "meetingBanner"
        else if (type === SPORT)
            return "sportBanner"
        else
            return "bg-white"
    }

    let renderBadge = () => {
        if (props.event.typology)
            return <EventBadge event={props.event} />
    }

    return (
        <section className={"row pt-2 " + getBannerClassName()}>
            <div className="col container-fluid">
                <div className="row d-flex align-items-center">
                    <div className="col-8 mb-1 px-1">
                        <h5 className={"m-0 " + (props.event.name ? "" : " d-none ")}>
                            {props.event.name}
                        </h5>
                    </div>
                    <div className="col-4 d-flex justify-content-end px-1">
                        {renderBadge()}
                    </div>
                </div>
                <div className="row d-flex align-items-center">
                    <div className="col-8 mb-1 px-1">
                        <h6 className={"m-0 " + (props.event.date || props.event.time ? "" : " d-none ")}>
                            {props.event.date} - {props.event.time}
                        </h6>
                        <h6 className={"m-0 " + (props.event.address ? "" : " d-none ")}>
                            {props.event.address}
                        </h6>
                    </div>
                    <div className="col-4 d-flex justify-content-end px-1">
                        <p className={"m-0 " + (props.event.maxParticipants ? "" : " d-none ")}>{props.event.numParticipants ? props.event.numParticipants : 0}/{props.event.maxParticipants}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

/**
 *
 * @param props: {
 *     event: {
 *         place: {
 *             place_id: String
 *         }
 *     }
 * }
 * @returns {*}
 * @constructor
 */
let EventLocation = props => {
    return (
        <section className="row">
            <div className="col-12">
                <h5>Luogo dell'evento</h5>
                <LocationMap place={props.event.place}/>
            </div>
        </section>
    )
}

let EventOrganizatorInfo = props => {
    return (
        <div className="row">
            <div className="col-12 px-0">
                <h6>Organizzatore</h6>
            </div>
            <div className="col-2 px-0">
                <UserAvatar user={props.organizator}/>
            </div>
            <div className="col-10 d-flex justify-content-start align-items-center">
                <span className="text-invited font-weight-bold">{props.organizator.name} {props.organizator.surname}</span>
            </div>
        </div>
    )
}

export {
    FollowButton,
    ParticipateButton,
    EventBadge,
    EventInteractionPanel,
    EventHeaderBanner,
    EventLocation,
    EventOrganizatorInfo,
    PARTY,
    SPORT,
    MEETING
}