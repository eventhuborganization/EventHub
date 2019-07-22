import React from 'react'
import './EventCard.css'
import { Link } from 'react-router-dom'
import {EventInteractionPanel} from '../event/Event'
let images = require.context("../../assets/images", true)

class EventCard extends React.Component {

    render() {
        return (
            <div className="row">
                <div className="col-11 card shadow my-2 mx-auto px-0">
                    <Link className="card bg-dark" id={this.props.eventInfo._id} from={this.props.location.pathname} to={"/event/" + this.props.eventInfo._id }>
                        <img src={images(`./${this.props.eventInfo.thumbnail}`)} className="card-img img-fluid myCard" alt="locandina evento" />
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
                    </Link>
                    <div className="card-body container-fluid py-2 px-2">
                        <EventInteractionPanel {...this.props}
                                               key={this.props.eventInfo._id + "eventInteractionPanel"}
                                               event={this.props.eventInfo} />
                    </div>
                </div>
            </div>
        )
    }
}

export default EventCard;