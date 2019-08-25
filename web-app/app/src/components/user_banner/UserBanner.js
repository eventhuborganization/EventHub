import React from 'react'
import {Link} from 'react-router-dom'
import {PLACEHOLDER_USER_CIRCLE, RoundedSmallImage} from "../image/Image";


export default function UserBanner(props) {
    return props.user.name ? (
        <div className={"row py-2 d-flex align-items-center" + (!!props.border ? " border-bottom" : "")}>
            <Link 
                to={"/users/" + props.user._id} 
                className={"col-4 col-md-2 col-lg-1" + (props.user.avatar ? "" : " d-flex align-self-stretch")}
                style={{textDecoration: "none"}}
            >
                <RoundedSmallImage imageName={props.user.avatar} placeholderType={PLACEHOLDER_USER_CIRCLE}/>
            </Link>
            <Link to={"/users/" + props.user._id} className="col px-0" style={{textDecoration: "none"}}>
                <div className="font-weight-bold text-dark">{props.user.name + (props.user.organization ? "" : " " + props.user.surname)}</div>
                <div className="text-muted small">{props.user.organization ? "Organizzazione" : "Utente"} - {props.user.address.city}</div>
            </Link>
            {
                props.showAddFriendButton ?
                <div className="col-3 text-center px-0"> 
                    <button id={"friendBtn" + props.user._id} className="btn btn-sm btn-primary" onClick={props.onAddFriend}>
                        {props.user.organization ? "Segui" : "Aggiungi"}
                    </button>
                </div> : ""
            }
        </div>
    ) : <div/>
}