import React from 'react'
import './EventCard.css'
import { Link } from 'react-router-dom'
import {EventInteractionPanel} from '../event/Event'
import ApiService from '../../services/api/Api'

class EventCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventInfo: props.eventInfo
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-11 card shadow my-2 mx-auto px-0">
                    <Link className="card bg-secondary" id={this.state.eventInfo._id} from={this.props.location.pathname} to={"/event/" + this.state.eventInfo._id }>
                        <div className={"myCard"}>
                            <img src={ApiService.getImageUrl(this.state.eventInfo.thumbnail)}
                                 className={"card-img img-fluid" + (this.state.eventInfo.thumbnail ? "" : " d-none ")}
                                 alt="locandina evento"
                            />
                        </div>
                        <div className="card-img-overlay text-white">
                            <div className="d-flex align-items-start flex-column h-100">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-8">
                                            <h5 className="card-title event-name">{this.state.eventInfo.name}</h5>
                                            <h6 className="card-subtitle text-muted event-text">{this.state.eventInfo.organizator.name} {this.state.eventInfo.organizator.surname}</h6>
                                        </div>
                                        <div className="col-4 d-flex justify-content-end">
                                            <h5 className="card-title event-name">{this.state.eventInfo.numParticipants}/{this.state.eventInfo.maxParticipants}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="container-fluid mt-auto mb-2">
                                    <div className="row">
                                        <div className="col-12 card-text event-text">
                                            <p className="m-0">{this.state.eventInfo.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <div className="card-body container-fluid py-2 px-2">
                        <EventInteractionPanel {...this.props}
                                               key={this.state.eventInfo._id + "eventInteractionPanel"}
                                               event={this.state.eventInfo}
                                               onEventParticipated={event =>  this.setState(prevState => {
                                                   let state = prevState
                                                   state.eventInfo.participants = event.participants
                                                   state.eventInfo.numParticipants = event.participants.length
                                                   return state
                                               })}
                                               onEventFollowed={event =>  this.setState(prevState => {
                                                   let state = prevState
                                                   state.eventInfo.followers = event.followers
                                                   return state
                                               })}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default EventCard;