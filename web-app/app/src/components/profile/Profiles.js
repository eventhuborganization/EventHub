import React from 'react';
import styles from './UserProfile.module.css'
import {Link} from "react-router-dom"
import EventCard from '../event_card/EventCard'
import MultipleElementsBanner from '../multiple_elements_banner/MultipleElementsBanner'
import ApiService from '../../services/api/Api'

export function LinkedUserAvatar(props){
    let avatar = props.linkedUser.avatar && props.linkedUser.avatar !== "" ? 
        <img 
            src={ApiService.getAvatarUrl(props.linkedUser.avatar)}
            className={"img-fluid border border-primary rounded-circle " + styles.friendsIcon} 
            alt={"Immagine profilo utente"}
        /> : 
        <div className={styles.friendsIcon}>
            <em className={"fas fa-user-circle fa-" + props.emptyAvatarSize + "x"}></em>
        </div>
    return (
        <Link className={"col d-flex align-items-center justify-content-center " + (!!props.margin ? "" : "pr-0")} to={"/users/" + props.linkedUser._id}>
            {avatar}
        </Link>
    )
}

export function EmptyUserAvatar(props){
    return (
        <div className={"col " + (!!props.margin ? "" : "pr-0")}>
            <div className={"h-100 border border-primary rounded-circle " + styles.friendsIcon} ></div>
        </div>
    )
}

export function MoreLinkedUsers(props){
    return (
        <div className="col d-flex justify-content-center align-items-center">
            <Link 
                to={props.moreLinkedUsersLink}
                className={"border border-primary rounded-circle w-100 h-100 d-flex justify-content-center align-items-center " + styles.friendsIcon}>
                    <em className="fas fa-ellipsis-h text-dark"></em>
            </Link>
        </div>
    )
}

export function LinkedUsersBanner(props) {
    let linkedUsers = props.linkedUsers
    let limit = props.numberToShow
    let avatars = []
    if(linkedUsers.length > 0){
        for(let x = 0; x < limit; x++){
            avatars.push(x >= linkedUsers.length ? 
                <EmptyUserAvatar key={"av" + x}/> 
                : <LinkedUserAvatar linkedUser={linkedUsers[x]} key={"av" + x} emptyAvatarSize={props.emptyAvatarSize}/>)
        }
        if(linkedUsers.length > limit + 1){
            avatars.push(<MoreLinkedUsers key={"av" + (limit + 1)} moreLinkedUsersLink={props.moreLinkedUsersLink}/>)
        } else if(linkedUsers.length === limit + 1){
            avatars.push(<LinkedUserAvatar linkedUser={linkedUsers[3]} margin={true} key={"av" + (limit + 1)} emptyAvatarSize={props.emptyAvatarSize}/>)
        } else {
            avatars.push(<EmptyUserAvatar margin={true} key={"av" + (limit + 1)}/>)
        }
    }

    return (
        <MultipleElementsBanner
            elements={avatars}
            title={props.typology}
            iconName={"user-friends"}
            emptyLabel={props.emptyLabel}
        />
    )
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
    let badge = props.badge !== "" ? [
        <div className="col d-flex justify-content-center">
            <div className="border border-primary rounded-circle p-5 d-flex flex-column text-center personal-badge">
                <em className="fas fa-rocket fa-5x"></em>
                <h6 className="mt-2 font-weight-bold">{props.badge.name}</h6>
                <p>{props.badge.description}</p>
            </div>
        </div>]: 
        []
    return (
        <MultipleElementsBanner
            elements={badge}
            title={"Ultimo badge ottenuto"}
            iconName={"trophy"}
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
                    isLogged={props.isLogged}
                    location={props.location}
    />)
    let elements = events.length > 0 ? [<div key={props.title + "-elems"} className="container-fluid">{events}</div>] : []
    return (
        <MultipleElementsBanner
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