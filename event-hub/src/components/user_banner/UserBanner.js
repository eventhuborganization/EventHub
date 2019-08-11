import React from 'react'
import {Link} from 'react-router-dom'
let images = require.context("../../assets/images", true)


export default function UserBanner(props) {
    return (
        <div className={"row py-2 d-flex align-items-center" + (!!props.border ? " border-bottom" : "")}>
            <Link to={"/users/" + props.user._id} className="col-3 col-md-1">
                <img src={(props.user.avatar ? images(`./${props.user.avatar}`) : '')}
                    className="img-fluid border rounded-circle"
                    alt="Immagine profilo utente"
                />
            </Link>
            <Link to={"/users/" + props.user._id} className="col-6 px-0" style={{textDecoration: "none"}}>
                <div className="font-weight-bold text-dark">{props.user.name + (props.user.organization ? "" : " " + props.user.surname)}</div>
                <div className="text-muted small">{props.user.organization ? "Organizzazione" : "Utente"} - {props.user.address.city}</div>
            </Link>
            {
                props.showAddFriendButton ?
                <div className="col-3 text-center pl-0"> 
                    <button className="btn btn-sm btn-primary" onClick={props.onAddFriend}>
                        {props.user.organization ? "Segui" : "Aggiungi"}
                    </button>
                </div> : ""
            }
        </div>
    )
}