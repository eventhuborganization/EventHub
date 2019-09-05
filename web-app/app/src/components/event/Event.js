import React from 'react'
import {Link} from 'react-router-dom'
import { LoginRedirect } from '../redirect/Redirect'
import './Event.css'
import { LocationMap } from '../map/Maps'
import ApiService from '../../services/api/Api'
import {PLACEHOLDER_USER_CIRCLE, RoundedSmallImage} from "../image/Image"

let PARTY = "party"
let SPORT = "sport"
let MEETING = "meeting"
let FOLLOW = 0
let PARTICIPATE = 1

let routes = require("../../services/routes/Routes")

let getButtonClassName = (eventType, buttonType, noMargin) => {
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
    let margin = noMargin ? "" : " ml-2"
    if (eventType === PARTY)
        return "btn partyButton partyButton" + buttonClass + margin
    else if (eventType === MEETING)
        return "btn meetingButton meetingButton" + buttonClass + margin
    else if (eventType === SPORT)
        return "btn sportButton sportButton" + buttonClass + margin
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

function UpdateButton(props) {
    return (
        <Link 
            to={{
                pathname: routes.updateEventFromId(props.event._id),
                state: {event: props.event}
            }} 
            className={getButtonClassName(props.event.typology, PARTICIPATE)}>
            Modifica evento
        </Link>
    )
}

function InviteButton(props) {
    return (
        <Link
            to={{
                pathname: routes.inviteEvent,
                event: props.event
            }}
            className={getButtonClassName(props.event.typology, PARTICIPATE, true)}>
            Invita
        </Link>
    )
}

/**
 * @param props {{
 *     event: {
 *         typology: string
 *     },
 *     onSent: function,
 *     showReviewModal: function
 * }}
 * @return {*}
 * @constructor
 */
let WriteReviewButton = props => {
    return (
        <button className={getButtonClassName(props.event.typology, PARTICIPATE) + (props.disabled ? " disabled" : "")}
                onClick={() => props.showReviewModal(props.event, props.onSent)}>
            Scrivi una recensione
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

    let date = props.event.date
    if(!(date instanceof Date)) {
        date = new Date(date)
    }
    let isEventPast = date - new Date() < 0
    let isOrganizator = props.user._id === props.event.organizator._id

    let renderInviteButton = () => {
        return props.isLogged && (isOrganizator || props.event.public) && !isEventPast ?
                <InviteButton {...props} event={props.event} /> : <div/>
    }

    let renderInteractionButtons = () => {
        if(props.hideInteractionButtons) {
            return <div/>
        } else if(!isOrganizator && !isEventPast){
            return <div>{followButton} {subscribeButton}</div>
        } else if(isOrganizator && !isEventPast) {
            return <UpdateButton {...props} event={props.event}/>
        } else if (isEventPast && !isOrganizator && props.showReviewModal instanceof Function) {
            return <WriteReviewButton 
                        onSent={props.onReviewSent} 
                        event={props.event} 
                        showReviewModal={props.showReviewModal}
                        disabled={props.isAlreadyBeenReviewed}
                    />
        } else {
            return <div/>
        }
    }

    return (
        <div className="row">
            <div className={" col-3 " + (props.hideBadge ? "" : " my-auto ")}>
                {
                    props.hideBadge ? renderInviteButton() :
                        <EventBadge {...props}
                            key={props.event._id + "badge"}
                            event={props.event} 
                        />
                }
            </div>
            <div className="col-9 d-flex justify-content-end">
                { renderInteractionButtons() }
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
 *     },
 *     isLite: boolean,
 *     hidePlace: boolean
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

    let renderOtherInfo = () => {
        if (props.isLite)
            return <div className={"pt-2"}/>
        else {
            let dateVal = props.event.date instanceof Date ? props.event.date : new Date(props.event.date)
            let date = require("../../utils/Utils").renderDate(dateVal)
            return (
                <div className="row d-flex align-items-center">
                    <div className="col-8 mb-1 pl-1 pr-0">
                        <h6 className={"m-0 text-left " + (props.event.date || props.event.time ? "" : " d-none ")}>
                            <em className="far fa-calendar-alt"></em> {date}
                        </h6>
                        {
                            props.hidePlace ? <div/> :
                                <h6 className={"m-0 text-left " + (props.event.location.address ? "" : " d-none ")}>
                                    <em className="fas fa-map-marker-alt"></em> {props.event.location.address}
                                </h6>
                        }
                    </div>
                    <div className="col-4 d-flex justify-content-end px-1">
                        <p className={"m-0 " + (props.event.maxParticipants ? "" : " d-none ")}>{props.event.numParticipants ? props.event.numParticipants : 0}/{props.event.maxParticipants}</p>
                    </div>
                </div>
            )
        }
    }

    return (
        <section className={"row pt-2 " + getBannerClassName()}>
            <div className="col container-fluid">
                <div className="row d-flex align-items-center">
                    <div className="col-8 mb-1 px-1">
                        <h5 className={"m-0 text-left " + (props.event.name ? "" : " d-none ")}>
                            {props.event.name}
                        </h5>
                    </div>
                    <div className={"col-4 d-flex justify-content-end px-1"}>
                        {renderBadge()}
                    </div>
                </div>
                {renderOtherInfo()}
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
                    to={routes.userFromId(props.organizator._id)} 
                    className="col-3 px-0"
                    style={{textDecoration: "none"}}>
                    <RoundedSmallImage imageName={props.organizator.avatar} placeholderType={PLACEHOLDER_USER_CIRCLE} />
                </Link>
                <Link 
                    to={routes.userFromId(props.organizator._id)}
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
    InviteButton,
    PARTY,
    SPORT,
    MEETING
}