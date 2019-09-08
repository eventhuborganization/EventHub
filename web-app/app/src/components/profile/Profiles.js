import React from 'react';
import styles from './UserProfile.module.css'
import {Link} from "react-router-dom"
import EventCard from '../event_card/EventCard'
import {MultipleElementsBanner, MultipleUsersBanner } from '../multiple_elements_banner/MultipleElementsBanner'
import { RoundedBigImage } from '../image/Image'

export function LinkedUsersBanner(props){
    return <MultipleUsersBanner
            level={"h6"} 
            users={props.linkedUsers}
            emptyLabel={props.emptyLabel}
            typology={props.typology}
            moreUsersLink={props.moreLinkedUsersLink}
            iconName={"user-friends"}
        />
}

export function ProfileBadge(props){
    let iconClass = props.iconName ? "fas fa-" + props.iconName : ""
    return (
        <div className={"text-primary border border-primary rounded-pill d-flex justify-content-between px-3 py-1 align-items-center " + styles.profileBadge}>
            <em className={iconClass}></em>
            <span className="ml-3">{props.number.toString().padStart(4, '0')}</span>
        </div>
    )
}

export function ProfileAction(props){
    let iconClass = props.iconName ? "fas fa-" + props.iconName : ""
    return props.show ? (
        <div id={props.id}>
            <button className="btn btn-lg btn-primary rounded-circle" onClick={props.actionSelected}>
                <em className={iconClass} aria-hidden="true"></em>
            </button>
        </div>
    ) : ""
}

export function BadgeBanner(props) {
    let badge = props.badge ? [
        <div className="col-12 d-flex align-items-center" key="lastBadge">
            <div className="row">
                <div className="col-4">
                    <RoundedBigImage
                        imageName={props.badge.icon}
                        alt={props.badge.description}
                        badge={true}
                    />
                </div>
                <div className="col-8 d-flex align-items-center">
                    <div>
                        <h4 className="mb-0">{props.badge.name}</h4>
                        <div>{props.badge.description}</div>
                    </div>
                </div>
            </div>
        </div>]: 
        []
    return (
        <MultipleElementsBanner
            level={"h6"}
            elements={badge}
            title={"Ultimo badge ottenuto"}
            iconName={"award"}
            emptyLabel={props.emptyLabel}
        />
    ) 
}

export function EventsBanner(props) {
    let events = props.events.map(event =>
        <EventCard  key={event._id}
                    eventInfo={event}
                    user={props.user}
                    onError={props.onError}
                    showReviewModal={props.showReviewModal}
                    isLogged={props.isLogged}
                    location={props.location}
    />)
    let elements = events.length > 0 ? [<div key={props.title + "-elems"} className="container-fluid">{events}</div>] : []
    return (
        <MultipleElementsBanner
            level={"h6"}
            elements={elements}
            title={props.title}
            iconName={"glass-cheers"}
            emptyLabel={props.emptyLabel}
        />
    )
}

export function ProfileControls(props){
    return !props.isLocalUser && !props.isMyFriend ? "" : (
        <div className="container-fluid">
            <div className="row">
                {
                    props.isMyFriend ? 
                        <div className="col d-flex justify-content-start align-items-center px-2">
                            <div className={"border border-danger rounded-pill px-2 py-1 " + styles.friendRemove} onClick={props.removeClicked}>
                                <em className="fas fa-minus"></em> Rimuovi
                            </div>
                        </div>
                    : <div/>
                }
                
                {
                    props.isLocalUser ?
                    <div className={"col d-flex justify-content-end align-items-center px-2"}> 
                        <Link to={props.settingsLink}>
                            <em className={"fas fa-cog fa-lg " + styles.settingsIcon}></em>
                        </Link>
                    </div>
                    : <div/>
                }
            </div>
        </div>
    )
}