import React from 'react';
import Axios from 'axios';
import './EventCard.css';

class EventCard extends React.Component {

    participate = () => {
        this.interactWithEvent({participant: true, event: this.props.eventInfo._id}, "Errore durante la partecipazione ad un evento. Riprovare.")
    }

    follow = () => {
        this.interactWithEvent({follower: true, event: this.props.eventInfo._id}, "Errore nel tentativo di seguire ad un evento. Riprovare.")
    }

    interactWithEvent = (message, errorMessage) => {
        Axios.post("http://" + this.props.mainServer + "/events", message)
            .then(response => {
                let status = response.status
                if (status !== 200) {
                    this.props.onError(errorMessage)
                }
            })
    }

    render() {
        let type = this.props.event.typology
        return (
            <div className="row">
                <div className="col-11 card shadow my-2 mx-auto px-0">
                    <div className="card bg-dark" id={this.props.eventInfo._id}>
                        <img src={"http://" + this.props.mainServer + this.props.eventInfo.thumbnail} className="card-img" alt="locandina evento" />
                        <div className="card-img-overlay text-white">
                            <div className="d-flex align-items-start flex-column h-100">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-8">
                                            <h5 className="card-title event-name">{this.props.eventInfo.name}</h5>
                                            <h6 className="card-subtitle text-muted event-text">{this.props.eventInfo.organizator.name}</h6>
                                        </div>
                                        <div className="col-4 d-flex justify-content-end">
                                            <h5 className="card-title event-name">{this.props.eventInfo.numParticipants}/{this.props.eventInfo.maxParticipants}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="container-fluid mt-auto mb-2">
                                    <div className="row">
                                        <div className="col-12 card-text event-text">
                                            <p className="m-0">{this.props.event.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body container-fluid py-2">
                        <div className="row">
                            <div className="col-3 my-auto">
                                <div className={"badge badge-pill " + type + " " + type + "Badge"}>#{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                            </div>
                            <div className={(this.props.isLogged ? "" : "d-none ") + "col-9 d-flex justify-content-end"}>
                                <button className={"btn " + type + "Button " + type + "ButtonSecondary"} onClick={this.participate}>Segui</button>
                                <button className={"btn " + type + "Button " + type + "ButtonPrimary ml-2"} onClick={this.follow}>Partecipa</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EventCard;