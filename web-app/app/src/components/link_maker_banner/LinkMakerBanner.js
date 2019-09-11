import React from 'react'
import {Link} from 'react-router-dom'
import {PLACEHOLDER_USER_CIRCLE, PLACEHOLDER_GROUP_CIRCLE, RoundedSmallImage} from "../image/Image"
import "./LinkMakerBanner.css"

export const INVITE_BUTTON = 0
export const ADD_FRIEND_BUTTON = 1
export const INVITED_BUTTON = 2
export const ADDED_FRIEND_BUTTON = 3

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
 *     buttonDisabled: boolean,
 *     isLite: boolean
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
        case ADDED_FRIEND_BUTTON:
            buttonText = props.elem.organization ? "Non seguire" : "Aggiunto"
            break
        default: break
    }
    let link = props.isGroup ? 
        {
            pathname: routes.groupFromId(props.elem._id),
            group: props.elem
        } : routes.userFromId(props.elem._id)
    let name = props.elem.name + " " + (props.elem.surname ? props.elem.surname : "")
    return props.elem.name && (props.isGroup ? props.buttonType !== ADD_FRIEND_BUTTON : true) ? (
        <div className={"row py-2 d-flex align-items-center" + (!!props.border ? " border-bottom" : "")}>
            <Link
                to={link}
                className={"col-4 col-md-2 col-xl-3 d-flex justify-content-center"}
                style={{textDecoration: "none"}}
            >
                <RoundedSmallImage 
                    imageName={props.elem.avatar} 
                    placeholderType={props.isGroup ? PLACEHOLDER_GROUP_CIRCLE : PLACEHOLDER_USER_CIRCLE}/>
            </Link>
            <Link to={link} className="col px-0" style={{textDecoration: "none"}}>
                <div className={"font-weight-bold text-dark " + (props.isGroup ? "elem-group-name" : "elem-name")}>{name}</div>
                {
                    props.isGroup || props.isLite
                        ? <div/>
                        : <div className="text-muted small elem-info">
                            {props.elem.organization ? "Organizzazione" : "Utente"} - {props.elem.address.city}
                        </div>
                }
            </Link>
            {
                props.showButton ? 
                <div className="col-3 text-center px-0">
                    <button id={props.buttonId} className={"btn btn-sm btn-primary button-size " + (props.buttonDisabled ? " disabled " : "")} onClick={props.onClick}>
                        {buttonText}
                    </button>
                </div> :<div/>
            }
            
        </div>
    ) : <div/>
}

export function UserBanner(props) {
    return props.user.name ? 
        <LinkMakerBanner
            buttonId={"friendBtn" + props.user._id}
            buttonType={ADD_FRIEND_BUTTON}
            border={props.border}
            elem={props.user}
            isGroup={false}
            onClick={props.onAddFriend}
            showButton={props.showAddFriendButton}
            isLite={props.isLite}
        /> : 
        <div/>
}