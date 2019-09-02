import React from 'react'
import {Link} from 'react-router-dom'
import {PLACEHOLDER_USER_CIRCLE, PLACEHOLDER_GROUP_CIRCLE, RoundedSmallImage} from "../image/Image"

export const INVITE_BUTTON = 0
export const ADD_FRIEND_BUTTON = 1
export const INVITED_BUTTON = 2

let routes = require("../../services/routes/Routes")

//"friendBtn" + props.user._id

/**
 *
 * @param props {{
 *     elem: {
 *         _id: string,
 *         name: string,
 *         surname: string,
 *         avatar: string,
 *         organization: boolean,
 *         address: {
 *             city: string
 *         }
 *     }
 *     isGroup: boolean,
*      border: boolean,
 *     onClick: function,
 *     showButton: boolean,
 *     buttonType: number,
 *     buttonId: string,
 *     buttonDisabled: boolean
 * }}
 * @return {*}
 * @constructor
 */
export function LinkMakerBanner(props) {
    let buttonText = ""
    switch(props.buttonType) {
        case INVITE_BUTTON:
            buttonText = "Invita"
            break
        case INVITED_BUTTON:
            buttonText = "Invitato"
            break
        case ADD_FRIEND_BUTTON:
            buttonText = props.elem.organization ? "Segui" : "Aggiungi"
            break
        default: break
    }
    let link = props.isGroup ? routes.groupFromId(props.elem._id) : routes.userFromId(props.elem._id)
    let name = props.elem.name + " " + (props.elem.surname ? props.elem.surname : "")
    return props.elem.name && (props.isGroup ? props.buttonType !== ADD_FRIEND_BUTTON : true) ? (
        <div className={"row py-2 d-flex align-items-center" + (!!props.border ? " border-bottom" : "")}>
            <Link
                to={link}
                className={"col-4 col-md-2 col-lg-1" + (props.elem.avatar ? "" : " d-flex align-self-stretch")}
                style={{textDecoration: "none"}}
            >
                <RoundedSmallImage 
                    imageName={props.elem.avatar} 
                    placeholderType={props.isGroup ? PLACEHOLDER_GROUP_CIRCLE : PLACEHOLDER_USER_CIRCLE}/>
            </Link>
            <Link to={link} className="col px-0" style={{textDecoration: "none"}}>
                <div className="font-weight-bold text-dark">{name}</div>
                {
                    props.isGroup
                        ? <div/>
                        : <div className="text-muted small">
                            {props.elem.organization ? "Organizzazione" : "Utente"} - {props.elem.address.city}
                        </div>
                }
            </Link>
            <div className="col-3 text-center px-0">
                {
                    props.showButton ?
                        <button id={props.buttonId} className={"btn btn-sm btn-primary " + (props.buttonDisabled ? " disabled " : "")} onClick={props.onClick}>
                            {buttonText}
                        </button> : <div/>
                }
            </div>
        </div>
    ) : <div/>
}

export function UserBanner(props) {
    let user = {...props.user}
    if(props.user.address && props.user.address.city)
        user.city = props.user.address.city
    return props.user.name ? 
        <LinkMakerBanner
            buttonId={"friendBtn" + props.user._id}
            buttonType={ADD_FRIEND_BUTTON}
            border={props.border}
            elem={user}
            isGroup={false}
            onClick={props.onAddFriend}
            showButton={props.showAddFriendButton}
        /> : 
        <div/>
}