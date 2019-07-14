import React from 'react';
import Axios from 'axios';
import './EventCard.css';
import { Redirect } from 'react-router-dom'

class EventCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
    }

    participate = () => {
        this.interactWithEvent({participant: true, event: this.props.eventInfo._id}, "Errore durante la partecipazione ad un evento. Riprovare.")
    }

    follow = () => {
        this.interactWithEvent({follower: true, event: this.props.eventInfo._id}, "Errore nel tentativo di seguire ad un evento. Riprovare.")
    }

    interactWithEvent = (message, errorMessage) => {
        if (this.props.isLogged)
            Axios.post(this.props.mainServer + "/events", message)
                .then(response => {
                    let status = response.status
                    if (status !== 200) {
                        this.props.onError(errorMessage)
                    }
                })
        else
            this.setRedirect(true)
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            this.setRedirect(false)
            return <Redirect from='/' to='/login' />
        }
    }

    setRedirect = (value) => {
        this.setState({redirect: value})
    }

    render() {
        let type = this.props.eventInfo.typology
        return (
            <div className="row">
                {this.renderRedirect()}
                <div className="col-11 card shadow my-2 mx-auto px-0">
                    <div className="card bg-dark" id={this.props.eventInfo._id}>
                        <img src={this.props.mainServer + this.props.eventInfo.thumbnail} className="card-img" alt="locandina evento" />
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
                                            <p className="m-0">{this.props.eventInfo.description}</p>
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
                            <div className={"col-9 "}>
                                <div className="d-flex justify-content-end">
                                    <button className={"btn " + type + "Button " + type + "ButtonSecondary"} onClick={this.participate}>Segui</button>
                                    <button className={"btn " + type + "Button " + type + "ButtonPrimary ml-2"} onClick={this.follow}>Partecipa</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EventCard;