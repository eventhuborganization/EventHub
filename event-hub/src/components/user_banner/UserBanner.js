import React from 'react'
import {Link} from 'react-router-dom'
let images = require.context("../../assets/images", true)


export default function UserBanner(props) {
    let button = props.showAddFriendButton ? 
        <button className="btn btn-sm btn-primary" onClick={props.onAddFriend}>
            Aggiungi
        </button> : ""

    return (
        <div className={"row py-2 d-flex align-items-center" + (!!props.border ? " border-bottom" : "")}>
            <Link to={"/users/" + props.user._id} className="col-3 col-md-1">
                <img src={(props.user.avatar ? images(`./${props.user.avatar}`) : '')}
                    className="img-fluid border rounded-circle"
                    alt="Immagine profilo utente"
                />
            </Link>
            <Link to={"/users/" + props.user._id} className="col-6 font-weight-bold px-0 text-dark" style={{textDecoration: "none"}}>
                {props.user.name}
            </Link>
            <div className="col-3 text-center pl-0">
                {button}
            </div>
        </div>
    )
}