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

/*class CallableComponent extends React.Component {
    componentDidMount() {
        if (this.props.onRef)
            this.props.onRef(this)
    }
    componentWillUnmount() {
        if (this.props.onRef)
            this.props.onRef(undefined)
    }
    render() {
        return (<div></div>)
    }
}

class RedirectComponent extends CallableComponent {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        this.setRedirect(false)
    }

    renderRedirect() {
        if (this.state.redirect) {
            return <Redirect from={this.props.from} to={this.props.to} />
        }
    }

    setRedirect(value) {
        this.setState({redirect: value})
    }

    render() {
        return (<div>{this.renderRedirect()}</div>)
    }
}

class LoginRedirect extends CallableComponent {
    constructor(props) {
        super(props)
        this.state = {
            redirectComponent: undefined
        }
    }

    doIfLogged(toDo) {
        if (this.props.isLogged)
            toDo()
        else if (this.state.redirectComponent)
            this.state.redirectComponent.setRedirect(true)
    }

    saveRedirectComponentRef(ref) {
        this.setState({redirectComponent: ref})
    }

    render() {
        return (
            <div>
                <RedirectComponent {...this.props}
                                   from={this.props.location.pathname}
                                   to={"/login"}
                                   onRef={ref => this.saveRedirectComponentRef(ref)}/>
            </div>
        )
    }
}*/

let party = "festa"
let sport = "sport"
let meeting = "meeting"
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
    if (eventType === party)
        return "btn partyButton partyButton" + buttonClass + " ml-2"
    else if (eventType === meeting)
        return "btn meetingButton meetingButton" + buttonClass + " ml-2"
    else if (eventType === sport)
        return "btn sportButton sportButton" + buttonClass + " ml-2"
}

let FollowButton = (props) => {

    let loginRedirect = undefined

    let onClick = () => {
        if (loginRedirect)
            loginRedirect.doIfLogged(() => follow(props.mainServer, props.event._id, props.onError))
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
            loginRedirect.doIfLogged(() => participate(props.mainServer, props.event._id, props.onError))
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
    if (props.event.typology === party) {
        typeClass = "party partyBadge"
        label = "Festa"
    } else if (props.event.typology === meeting) {
        typeClass = "meeting meetingBadge"
        label = "Incontro"
    }
    else if (props.event.typology === sport) {
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
                              event={props.notification.event} />
                <ParticipateButton {...props}
                                   key={props.event._id + "participatebutton"}
                                   event={props.notification.event} />
            </div>
        </div>
    )
}

export {FollowButton, ParticipateButton, EventBadge, EventInteractionPanel}