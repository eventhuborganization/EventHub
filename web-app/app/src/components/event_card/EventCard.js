import React from 'react'
import './EventCard.css'
import { Link } from 'react-router-dom'
import {EventInteractionPanel} from '../event/Event'
import {IMAGE, ImageForCard} from "../image/Image"

let routes = require("../../services/routes/Routes")

class EventCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventInfo: props.eventInfo
        }
    }

    onEventFollowed = event => {
        this.onEventFollowInteraction(event)
        this.props.onSuccess("Da adesso segui l'evento, se ci saranno modifiche verrai informato!")
    }

    onEventParticipated = event =>  {   
        this.onEventParticipateInteraction(event)
        this.props.onSuccess("Partecipi all'evento!")
    }

    onEventFollowInteraction = event => {
        this.setState(prevState => {
            let state = prevState
            state.eventInfo.followers = event.followers
            return state
        })
    }

    onEventParticipateInteraction = event =>  {   
        this.setState(prevState => {
            let state = prevState
            state.eventInfo.participants = event.participants
            state.eventInfo.numParticipants = event.participants.length
            return state
        })
    }

    renderDate = () => {
        let utils = require("../../utils/Utils")
        return utils.renderDate(this.state.eventInfo.date)
    }

    render() {
        return (
            <div className="row">
                <div className="col-11 card shadow my-2 mx-auto px-0">
                    <Link className="card bg-secondary" id={this.state.eventInfo._id} from={this.props.location.pathname} to={routes.eventFromId(this.state.eventInfo._id)}>
                        <ImageForCard imageName={this.state.eventInfo.thumbnail} type={IMAGE} />
                        <div className="card-img-overlay text-white pb-1">
                            <div className="d-flex align-items-start flex-column h-100">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-8 pl-0">
                                            <h5 className="card-title event-name">{this.state.eventInfo.name}</h5>
                                            <h6 className="card-subtitle event-text">{this.state.eventInfo.organizator.name} {this.state.eventInfo.organizator.surname}</h6>
                                        </div>
                                        <div className="col-4 px-0 d-flex justify-content-end">
                                            <h5 className="card-title event-name">{this.state.eventInfo.numParticipants} / {this.state.eventInfo.maxParticipants}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="container-fluid mt-auto mb-2">
                                    <div className="row">
                                        <div className="col-12 px-0 card-text event-text">
                                            {
                                                this.state.eventInfo.date ? 
                                                    <div className="event-place row">
                                                        <div className="col-1 pr-0"><em className="far fa-calendar-alt"></em></div> 
                                                        <div className="col-11">{this.renderDate()}</div>
                                                    </div> : <div/>
                                            }
                                            {
                                                this.state.eventInfo.location && this.state.eventInfo.location.address ? 
                                                    <div className="event-place row">
                                                        <div className="col-1 pr-0"><em className="fas fa-map-marker-alt"></em></div>  
                                                        <div className="col-11">{this.state.eventInfo.location.address}</div>
                                                    </div> : <div/>
                                            }
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
                                               onEventParticipated={this.onEventParticipated}
                                               onEventFollowed={this.onEventFollowed}
                                               onEventUnfollowed={this.onEventFollowInteraction}
                                               onEventUnsubscribed={this.onEventParticipateInteraction}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default EventCard;