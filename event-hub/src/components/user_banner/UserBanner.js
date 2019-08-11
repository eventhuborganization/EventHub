import React from 'react'
import {Link} from 'react-router-dom'
import Api from '../../services/api/Api'


export default function UserBanner(props) {
    return (
        <div className={"row py-2 d-flex align-items-center" + (!!props.border ? " border-bottom" : "")}>
            <Link to={"/users/" + props.user._id} className={"col-3 col-md-2 col-lg-1" + (props.user.avatar ? "" : " d-flex align-self-stretch")}>
                {
                    props.user.avatar ?
                        <img src={Api.getAvatarUrl(props.user.avatar)}
                            className="img-fluid border rounded-circle"
                            alt="Immagine profilo utente"
                        /> :
                        <div className="text-secondary border border-primary rounded-circle w-100 h-100 d-flex justify-content-center align-items-center">
                            <em className="far fa-image fa-2x"></em>
                        </div>
                }
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