import React from 'react'
import './Notification.css'
import {EventInteractionPanel} from '../event/Event'
import ApiService from '../../services/api/Api'

class Notification extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            notificationTypes: {
                0: "Ti ha invitato ad un evento.",
                1: "Ti ha inviato la richiesta d'amicizia.",
                2: "Ha iniziato a seguirti.",
                3: "Nuovo badge ottenuto.",
                4: "Vuole sapere la tua posizione.",
                5: "Ti ha (fatto una domanda/risposto).",
                6: "Ha organizzato un nuovo evento.",
                7: "Ha modificato l'evento.",
                8: "Ha accettato la tua richiesta d'amicizia.",
                9: "Ti ha inviato la sua posizione."
            }
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
                    buttons={[<RejectFriendshipButton key={this.props.notification._id + "rejectFriend"} />, <AcceptFriendshipButton key={this.props.notification._id + "acceptFriend"} />]} />
            case 4:
                return <UserNotificationInteractionPanel key={this.props.notification._id + "userPanel"}
                    buttons={[<RejectSharePositionButton key={this.props.notification._id + "rejectPos"} />, <SharePositionButton key={this.props.notification._id + "sharePos"} />]} />
            case 9:
                return <LocationMap notification={this.props.notification} />
            case 3:
                break //return badge
            case 2:
            case 8:
                break
            default:
                break
        }
    }

    getDescriptionComponentByType(type) {
        switch(type) {
            case 0:
            case 5:
            case 6:
            case 7:
                return <Eventdescription event={this.props.notification.event} />
            case 1:
            case 3:
            case 4:
            case 8:
            case 9:
            case 2:
                return <UserDescription description={this.state.notificationTypes[type]} />
            default:
                break
        }
    }

    getBottomBarByType(type) {
        if (this.isEventType(type)) {
            return <EventInteractionPanel {...this.props}
                                          key={this.props.notification._id}
                                          event={this.props.notification.event} />
        }
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
                        <div className="row">
                            <div className="col-8">
                                <NotificationSenderInformation notification={this.props.notification}
                                                               description={(this.isEventType(type) ? this.state.notificationTypes[type].toString() : "")} />
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
                        {this.getBottomBarByType(type)}
                    </div>
                </div>
            </div>
        )
    }
}

let NotificationSenderInformation = (props) => {
    let timestamp = new Date(new Date() - Date.parse(props.notification.timestamp))
    return (
        <div className="row">
            <div className="col-2 px-0 my-auto">
                <img src={ApiService.getImageUrl(props.notification.sender.avatar)} className="img-fluid border rounded-circle" alt="Immagine profilo utente" />
            </div>
            <div className="col-10 d-flex flex-column justify-content-center">
                <span className="text-secondary time-passed">{timestamp.getMinutes()} min</span>
                <span className="text-invited"><span className="font-weight-bold">{props.notification.sender.name} {props.notification.sender.surname}</span> {props.description}</span>
            </div>
        </div>
    )
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
    return (<h5 className="font-weight-bold">{props.event.name}</h5>)
}

let UserDescription = (props) => {
    return (<p>{props.description}</p>)
}

let LocationMap = (props) => {
    return (
        <div className="embed-responsive embed-responsive-16by9">
            <iframe
                title={props.notification._id + " loaction"}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2862.8552303608158!2d12.235158712371355!3d44.14822954462452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132ca55098146cbf%3A0x6de70b93cd4aed53!2sUniversit%C3%A0+di+Bologna+-+Campus+di+Cesena!5e0!3m2!1sit!2sit!4v1561908171773!5m2!1sit!2sit"
                className="embed-responsive-item"
                style={{border: 0}} allowFullScreen>
            </iframe>
        </div>
    )
}

let AcceptFriendshipButton = (props) => {
    return (
        <button className="btn btn-primary" type="button">
            <em className="fas fa-user-plus fa-md"></em>
        </button>
    )
}

let RejectFriendshipButton = (props) => {
    return (
        <button className="btn btn-outline-primary" type="button">
            <em className="fas fa-user-times fa-md"></em>
        </button>
    )
}

let SharePositionButton = (props) => {
    return (
        <button className="btn btn-primary" type="submit">
            <em className="fas fa-street-view fa-lg"></em>
        </button>
    )
}

let RejectSharePositionButton = (props) => {
    return (
        <button className="btn btn-outline-primary" type="submit">
            <em className="fas fa-times fa-lg"></em>
        </button>
    )
}

export default Notification