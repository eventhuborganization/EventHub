import React from 'react';
import styles from './UserProfile.module.css';
import {Link} from "react-router-dom";

let images = require.context("../../assets/images", true)

export function LinkedUserAvatar(props){
    return (
        <Link className="col pr-0" to={"/users/" + props.linkedUser._id}>
            <img 
                src={images(`./${props.linkedUser.avatar}`)} 
                className={"img-fluid border border-primary rounded-circle " + styles.friendsIcon} 
                alt="Immagine profilo utente"/>
        </Link>
    )
}

export function MoreLinkedUsers(){
    return (
        <div className="col d-flex justify-content-center align-items-center">
            <div className={"border border-primary rounded-circle w-100 h-100 d-flex justify-content-center align-items-center " + styles.friendsIcon}>
                <em className="fas fa-ellipsis-h"></em>
            </div>
        </div>
    )
}

export function LinkedUsersBanner(props) {
    let linkedUsers = props.linkedUsers.map(elem => <LinkedUserAvatar linkedUser={elem} />)
    let more = linkedUsers.length > 3 ? 
        <MoreLinkedUsers /> : 
        <div className="col-11 col-md-6 mx-auto border border-primary p-2 empty-list"> 
            {props.emptyLabel}
        </div>

    return (
        <div>
            <div className="row">
                <div className="col">
                    <h6><em className="fas fa-user-friends"></em> {props.typology}</h6>
                </div>
            </div>
            <div className="row">
                {linkedUsers.slice(0, 3)}
                {more}
            </div>
        </div>
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
    return (
        <div id={props.id} className={props.show ? " " : "d-none"}>
            <button className="btn btn-lg btn-primary rounded-circle" onClick={props.actionSelected}>
                <em className={iconClass} aria-hidden="true"></em>
            </button>
        </div>
    )
}

export function BadgeBanner(props) {
    return (
        <div>
            <div className="row">
                <div className="col">
                    <h6><em className="fas fa-trophy"></em> Ultimo badge ottenuto</h6>
                </div>
            </div>
            <div className="row">
                <div className="col d-flex justify-content-center">
                    <div className="border border-primary rounded-circle p-5 d-flex flex-column text-center personal-badge">
                        <em className="fas fa-rocket fa-5x"></em>
                        <h6 className="mt-2 font-weight-bold">{props.badge.name}</h6>
                        <p>{props.badge.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ProfileControls(props){
    return !props.isLocalUser && !props.isMyFriend ? "" : (
        <div className="container-fluid">
            <div className="row">
                <div className="col d-flex justify-content-start align-items-center px-2">
                    <div className={props.isMyFriend ? "border border-danger rounded-pill px-2 py-1 " + styles.friendRemove : "d-none"} onClick={props.removeClicked}>
                        <em className="fas fa-minus"></em> Rimuovi
                    </div>
                </div>
                <div className={props.isLocalUser ? "col d-flex justify-content-end align-items-center px-2" : "d-none"}>
                    <em className={"fas fa-cog fa-lg " + styles.settingsIcon} onClick={props.settingsClicked}></em>
                </div>
            </div>
        </div>
    )
}