import React from 'react'
import {Link} from 'react-router-dom'
import Api from '../../services/api/Api'


export default function UserBanner(props) {
    return props.user.name ? (
        <div className={"row py-2 d-flex align-items-center" + (!!props.border ? " border-bottom" : "")}>
            <Link 
                to={"/users/" + props.user._id} 
                className={"col-3 col-md-2 col-lg-1" + (props.user.avatar ? "" : " d-flex align-self-stretch")}
                style={{textDecoration: "none"}}
            >
                {
                    props.user.avatar ?
                        <img src={Api.getAvatarUrl(props.user.avatar)}
                            className="img-fluid border rounded-circle"
                            alt="Immagine profilo utente"
                        /> :
                        <div className="w-100 d-flex justify-content-center align-items-center text-secondary">
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
                <div className="col-3 text-center px-0"> 
                    <button id={"friendBtn" + props.user._id} className="btn btn-sm btn-primary" onClick={props.onAddFriend}>
                        {props.user.organization ? "Segui" : "Aggiungi"}
                    </button>
                </div> : ""
            }
        </div>
    ) : <div/>
}