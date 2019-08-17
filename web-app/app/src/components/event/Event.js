import React from 'react'
import { LoginRedirect } from '../redirect/Redirect';
import './Event.css'
import {LocationMap} from '../map/Maps'
import ApiService from '../../services/api/Api'

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

class FollowButton extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loginRedirect: undefined
        }
    }

    onClick = () => {
        if (this.state.loginRedirect)
            this.state.loginRedirect.doIfLoggedOrElseRedirect(
                () => ApiService.followEvent(this.props.event._id, this.props.onError))
    }

    render () {
        return (
            <button className={getButtonClassName(this.props.event.typology, FOLLOW)}
                    onClick={this.onClick}>
                <LoginRedirect {...this.props} onRef={ref => this.setState({ loginRedirect: ref })}/>
                Segui
            </button>
        )
    }
}

class ParticipateButton extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loginRedirect: undefined
        }
    }

    onClick = () => {
        if (this.state.loginRedirect)
            this.state.loginRedirect.doIfLoggedOrElseRedirect(
                () => ApiService.participateToEvent(this.props.event._id, this.props.onError))
    }

    render () {
        return (
            <button className={getButtonClassName(this.props.event.typology, PARTICIPATE)}
                    onClick={this.onClick}>
                <LoginRedirect {...this.props} onRef={ref => this.setState({ loginRedirect: ref })}/>
                Partecipa
            </button>
        )
    }
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
 * @param props {{
 *     event: {
 *         typology: string,
 *         name: string,
 *         date: string,
 *         time: string,
 *         address: {
 *             address: string
 *         },
 *         numParticipants: number,
 *         maxParticipants: number
 *     }
 * }}
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

    let renderDate = () => {
        let date = props.event.date
        if (!(date instanceof Date)) {
            date = new Date(date)
        }
        let hours = date ? date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours() : "00"
        let minutes = date ? date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes() : "00"
        return date
            ? date.getUTCDate() + "/" + date.getUTCMonth() + "/" + date.getUTCFullYear() + " - " + hours + ":" + minutes
            : ""
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
                            {renderDate()}
                        </h6>
                        <h6 className={"m-0 " + (props.event.location.address ? "" : " d-none ")}>
                            {props.event.location.address}
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
                <LocationMap place={props.event.location}/>
            </div>
        </section>
    )
}

let EventOrganizatorInfo = props => {

    //if (props.organizator && props.organizator.name && props.organizator.surname && props.organizator.avatar)
        return (
            <div className="row">
                <div className="col-12 px-0">
                    <h6>Organizzatore</h6>
                </div>
                <div className="col-2 px-0 ">
                    <img src={ApiService.getImageUrl(props.organizator.avatar)}
                         className={"img-fluid border rounded-circle " + (props.organizator.avatar ? "" : " d-none ")}
                         alt="Immagine profilo organizzatore"
                    />
                </div>
                <div className="col-10 d-flex justify-content-start align-items-center">
                    <span className="text-invited font-weight-bold">{props.organizator.name} {props.organizator.surname}</span>
                </div>
            </div>
        )
    /*else
        return (<div />)*/
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