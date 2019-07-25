import React from 'react';
import EventCard from '../event_card/EventCard'
import './MultipleEventCard.css'

export default function MultipleEventCard(props) {
    let iconClass = props.iconName ? "fas fa-" + props.iconName : ""
    let events = props.events.map(event =>
        <EventCard  key={event._id}
                    eventInfo={event}
                    onError={props.onError}
                    isLogged={props.isLogged}
                    location={props.location}
    />)
    return (
        <div>
            <div className="row">
                <div className="col">
                    <h6><em className={iconClass}></em> {props.title}</h6>
                </div>
            </div>
            {
                events.length === 0 ?
                <div className="row">
                    <div className="col-11 col-md-6 mx-auto border border-primary p-2 empty-list"> 
                        {props.emptyListLabel} 
                    </div>
                </div> : events
            }
        </div>
    )
}