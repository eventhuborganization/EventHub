import React from 'react'
import {Link} from 'react-router-dom'
import './Notification.css'
import {EventInteractionPanel} from '../event/Event'
import ApiService from '../../services/api/Api'
import GeoLocation from '../../services/location/GeoLocation'
import {LocationMap} from "../map/Maps"
import {PLACEHOLDER_USER_CIRCLE, RoundedSmallImage} from "../image/Image"

let routes = require("../../services/routes/Routes")

class Notification extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            notificationTypes: {
                0: "Ti ha invitato all'evento",
                1: "Ti ha inviato una richiesta d'amicizia.",
                2: "Ha iniziato a seguirti.",
                3: "Nuovo badge ottenuto.",
                4: "Vuole sapere la tua posizione.",
                5: "Ti ha (fatto una domanda/risposto).",
                6: "Ha organizzato un nuovo evento",
                7: "Ha modificato l'evento ",
                8: "Ha accettato la tua richiesta d'amicizia.",
                9: "Ti ha inviato la sua posizione.",
                10: "Non ha accettato di inviarti la sua posizione."
            }
        }
        if(this.props.notification.typology === 8){
            this.props.onFriendAdded(this.props.notification.sender)
        }
    }

    handleFriendshipRequest = (accepted) => {
        ApiService.sendFriendshipResponse(
            this.props.notification.sender._id, 
            accepted,
            this.props.notification._id,
            () => this.props.onError("Si è verificato un errore durante l'invio della risposta, riprova"),
            () => {
                this.props.deleteNotification(this.props.notification._id)
                if(accepted) {
                    this.props.onFriendAdded(this.props.notification.sender)
                }
            }
        )
    }

    handlePositionRequest = (accepted) => {
        if(accepted){
            GeoLocation.getCurrentLocation(
                () =>
                    this.props.onError("Si è verificato un problema nell'acquisizione della posizione attuale, riprovare."),
                position => {
                    let coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    ApiService.sendFriendPositionResponse(
                        coords,
                        accepted,
                        this.props.notification.sender._id,
                        this.props.notification._id,
                        () => this.props.onError("Si è verificato un errore durante l'invio della posizione, riprova"),
                        () => this.props.deleteNotification(this.props.notification._id)
                    )
                }
            )
        } else {
            ApiService.sendFriendPositionResponse(
                {},
                accepted,
                this.props.notification.sender._id,
                this.props.notification._id,
                () => this.props.onError("Si è verificato un errore durante l'invio della posizione, riprova"),
                () => this.props.deleteNotification(this.props.notification._id)
            )
        }
        
    }

    rightComponentByType = (type) => {
        switch(type) {
            case 0:
            case 5:
            case 6:
            case 7:
                return <EventImage imageFolderPath={this.props.imageFolderPath}
                                   event={this.props.notification.event} />
            case 1:
                return <UserNotificationInteractionPanel key={this.props.notification._id + "userPanel"}
                            buttons={[
                                <RejectFriendshipButton 
                                    key={this.props.notification._id + "rejectFriend"} 
                                    onClick={() => this.handleFriendshipRequest(false)} 
                                />, 
                                <AcceptFriendshipButton 
                                    key={this.props.notification._id + "acceptFriend"} 
                                    onClick={() => this.handleFriendshipRequest(true)} 
                                />
                            ]} 
                        />
            case 4:
                return <UserNotificationInteractionPanel key={this.props.notification._id + "userPanel"}
                            buttons={[
                                <RejectSharePositionButton
                                    key={this.props.notification._id + "rejectPos"}
                                    onClick={() => this.handlePositionRequest(false)}
                                />,
                                <SharePositionButton
                                    key={this.props.notification._id + "sharePos"}
                                    onClick={() => this.handlePositionRequest(true)}
                                />
                            ]}
                        />
            case 9:
                return <LocationMap place={{location: this.props.notification.position}} />
            case 3:
                break //return badge
            case 2:
            case 8:
            case 10:
                break
            default:
                break
        }
    }

    getParentComponentByType(type, child) {
        return this.isEventType(type) ? 
            <Link 
                to={routes.eventFromId(this.props.notification.event._id)} 
                className="text-dark"
                style={{textDecoration: "none"}}>{child}</Link>
            : child
    }

    getDescriptionComponentByType(type) {
        return this.isEventType(type) ? 
            <Eventdescription description={this.state.notificationTypes[type]} event={this.props.notification.event} />
            : <UserDescription description={this.state.notificationTypes[type]} />
    }

    getBottomBarByType(type) {
        return this.isEventType(type) ? 
            <EventInteractionPanel {...this.props}
                                    key={this.props.notification._id}
                                    event={this.props.notification.event}
                                    hideInteractionButtons={true}
                                    showReviewModal={this.props.showReviewModal}
            /> : <div/>
    }

    isEventType = (type) => {
        return type === 0 || type === 5 || type === 6 || type === 7
    }

    render() {
        let type = this.props.notification.typology
        return (
            <div className="row">
                <div className="col card shadow my-2 mx-2 px-0">
                    <div className="card-body container-fluid py-2">
                        {this.getParentComponentByType(type, 
                            <div className="row">
                                <div className="col-8">
                                    <NotificationSenderInformation notification={this.props.notification} />
                                    <div className="row mt-2">
                                        <div className="col-12">
                                            {this.getDescriptionComponentByType(type)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4 pl-0 pr-1 pt-1">
                                    {this.rightComponentByType(type)}
                                </div>
                            </div>
                        )}
                        {this.getBottomBarByType(type)}
                    </div>
                </div>
            </div>
        )
    }
}

class NotificationSenderInformation extends React.Component {

    getTime = () => {
        let diff = new Date(new Date() - this.props.notification.timestamp)
        let years = diff.getUTCFullYear() - 1970
        let months = diff.getUTCMonth()
        let days = diff.getUTCDate() - 1
        let hours = diff.getUTCHours()
        let minutes = diff.getUTCMinutes()
        let seconds = diff.getUTCSeconds()
        let time = ""
        if(years > 0) {
            time = years + (years > 1 ? " anni" : " anno")
        } else if(months > 0){
            time = months + (months > 1 ? " mesi" : " mese")
        } else if(days > 0){
            time = days + (days > 1 ? " giorni" : " giorno")
        } else if(hours > 0){
            time = hours + (hours > 1 ? " ore " : " ora ")
        } else if(minutes > 0) {
            time += minutes + (minutes > 1 ? " minuti" : " minuto")
        } else {
            time += seconds + (seconds > 1 ? " secondi" : " secondo")
        }
        return time + " fa"
    }

    render = () => {
        return (
            <div className="row">
                <div className="col-3 px-0 my-auto">
                    <RoundedSmallImage imageName={this.props.notification.sender.avatar} placeholderType={PLACEHOLDER_USER_CIRCLE} alt={"Immagine profilo utente"} />
                </div>
                <div className="col-9 d-flex flex-column justify-content-center px-1">
                    <span className="text-secondary time-passed">{this.getTime()}</span>
                    <span className="text-invited"><span className="font-weight-bold">{this.props.notification.sender.name} {this.props.notification.sender.surname}</span> {this.props.description}</span>
                </div>
            </div>
        )
    }
}

let UserNotificationInteractionPanel = (props) => {
    return (
        <div className="h-100 d-flex justify-content-between align-items-center">
            {props.buttons}
        </div>
    )
}

let EventImage = (props) => {
    return (
        <img src={ApiService.getImageUrl(props.event.thumbnail)}
             className="img-fluid"
             alt="locandina evento" />
    )
}

let Eventdescription = (props) => {
    return (<p>{props.description} <b>{props.event.name}</b></p>)
}

let UserDescription = (props) => {
    return (<p>{props.description}</p>)
}

let AcceptFriendshipButton = (props) => {
    return (
        <button className="btn btn-primary" type="button" onClick={props.onClick}>
            <em className="fas fa-user-plus fa-md"></em>
        </button>
    )
}

let RejectFriendshipButton = (props) => {
    return (
        <button className="btn btn-outline-primary" type="button" onClick={props.onClick}>
            <em className="fas fa-user-times fa-md"></em>
        </button>
    )
}

let SharePositionButton = (props) => {
    return (
        <button className="btn btn-primary" type="submit" onClick={props.onClick}>
            <em className="fas fa-street-view fa-lg"></em>
        </button>
    )
}

let RejectSharePositionButton = (props) => {
    return (
        <button className="btn btn-outline-primary" type="submit" onClick={props.onClick}>
            <em className="fas fa-times fa-lg"></em>
        </button>
    )
}

export default Notification