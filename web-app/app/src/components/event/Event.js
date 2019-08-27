import React from 'react'
import { Link } from 'react-router-dom'
import { LoginRedirect } from '../redirect/Redirect'
import './Event.css'
import { LocationMap } from '../map/Maps'
import ApiService from '../../services/api/Api'
import {PLACEHOLDER_USER_CIRCLE, RoundedSmallImage} from "../image/Image";

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
                () => ApiService.followEvent(
                    this.props.event._id,
                    () => this.props.onError("Errore nel tentativo di seguire un evento. Riprovare."),
                    this.props.onSuccess
                )
            )
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

class UnfollowButton extends React.Component {

    onClick = () => {
        ApiService.unfollowEvent(
            this.props.event._id,
            () => this.props.onError("Si è verificato un errore. Riprovare."),
            this.props.onSuccess
        )
    }

    render () {
        return (
            <button className={getButtonClassName(this.props.event.typology, FOLLOW) + " p-1"}
                    onClick={this.onClick}>
                Non seguire
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
                () => ApiService.participateToEvent(
                    this.props.event._id,
                    () => this.props.onError("I posti disponibili potrebbero essere terminati. Riprovare."),
                    this.props.onSuccess
                )
            )
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

class UnsubscribeButton extends React.Component {

    onClick = () => {
        ApiService.unsubscribeToEvent(
            this.props.event._id,
            () => this.props.onError("Si è verificato un errore. Riprovare."),
            this.props.onSuccess
        )
    }

    render () {
        return (
            <button className={getButtonClassName(this.props.event.typology, PARTICIPATE)}
                    onClick={this.onClick}>
                Ritirati
            </button>
        )
    }
}

function UpdateButton(props){
    return (
        <Link 
            to={{
                pathname: "/event/" + props.event._id + "/update",
                state: {event: props.event}
            }} 
            className={getButtonClassName(props.event.typology, PARTICIPATE)}>
            Modifica evento
        </Link>
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
    let followButton = props.isLogged && props.event.followers.includes(props.user._id) ?
        <UnfollowButton {...props}
            key={props.event._id + "unfollowbutton"}
            event={props.event}
            onSuccess={props.onEventUnfollowed}
        /> :
        <FollowButton {...props}
            key={props.event._id + "followbutton"}
            event={props.event}
            onSuccess={props.onEventFollowed}
        />
    let subscribeButton = props.isLogged && props.event.participants.includes(props.user._id) ?
        <UnsubscribeButton {...props}
            key={props.event._id + "unsubscribebutton"}
            event={props.event}
            onSuccess={props.onEventUnsubscribed}
        /> :
        <ParticipateButton {...props}
            key={props.event._id + "subscribebutton"}
            event={props.event}
            onSuccess={props.onEventParticipated}
        />


    return (
        <div className="row">
            <div className="col-3 my-auto">
                {
                    props.hideBadge ? <div/> : 
                        <EventBadge {...props}
                            key={props.event._id + "badge"}
                            event={props.event} 
                        />
                }
            </div>
            <div className="col-9 d-flex justify-content-end">
                {
                    props.user._id !== props.event.organizator._id && props.event.date - new Date() > 0 ? 
                        <div>{followButton} {subscribeButton}</div> :
                        (
                            props.user._id === props.event.organizator._id ? 
                            <UpdateButton {...props} event={props.event}/> : <div/>
                        )
                }
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
        let hours = date && date.getHours() >= 0
            ? date.getHours().toString().padStart(2,"0")
            : undefined
        let minutes = date && date.getMinutes() >= 0
            ? date.getMinutes().toString().padStart(2,"0")
            : undefined
        let displayTime = hours && minutes
            ? hours + ":" + minutes
            : undefined
        let displayDate = date && date.getDate() && date.getMonth() && date.getFullYear()
            ? date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
            : undefined
        return displayDate && displayTime
            ? displayDate + " - " + displayTime
            : "Data e orario non specificati"
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
        return props.organizator ? (
            <div className="row">
                <div className="col-12 px-0">
                    <span className={props.level}>Organizzatore</span>
                </div>
                <Link
                    to={"/users/" + props.organizator._id} 
                    className="col-3 px-0"
                    style={{textDecoration: "none"}}>
                    <RoundedSmallImage imageName={props.organizator.avatar} placeholderType={PLACEHOLDER_USER_CIRCLE} />
                </Link>
                <Link 
                    to={"/users/" + props.organizator._id}
                    className="col-9 d-flex justify-content-start align-items-center"
                    style={{textDecoration: "none"}}>
                    <span className="text-invited font-weight-bold text-dark">
                        {
                            props.organizator.organization ? 
                            <div> {props.organizator.name} <em className="text-secondary fas fa-user-tie" style={{fontSize: "larger"}}></em></div> : 
                            <div>{props.organizator.name} {props.organizator.surname}</div>
                        }
                    </span>
                </Link>
            </div>
        ) : <div />
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