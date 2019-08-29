import React from "react"
import ApiService from "../../services/api/Api";
import './Image.css'

let AVATAR = 0
let IMAGE = 1
let LOCAL = 2

let BORDER_PRIMARY = 0

let PLACEHOLDER_USER_CIRCLE = 0
let PLACEHOLDER_IMAGE = 0

/**
 * @param props {{
 *     imageName: string,
 *     type: number,
 *     text: string
 * }}
 * @return {*}
 * @constructor
 */
let ImageForCard = props => {
    let url = undefined
    switch(props.type) {
        case AVATAR:
            url = ApiService.getAvatarUrl(props.imageName)
            break
        case IMAGE:
            url = ApiService.getImageUrl(props.imageName)
            break
        case LOCAL:
            url = props.imageName
            break
        default: break
    }
    let altDisplayClass = props.text
        ? " d-flex flex-column justify-content-center align-items-center "
        : " d-flex justify-content-center align-items-center "
    let renderText = () => {
        if (props.text)
            return <h4>{props.text}</h4>
    }
    return (props.imageName && url ?
        <img src={url}
             className={"card-img img-fluid myCard"}
             alt="Immagine profilo utente"
        /> :
        <div className={"bg-secondary text-white myCard" + altDisplayClass}>
            <em className="far fa-image fa-9x"></em>
            {renderText()}
        </div>)
}

/**
 * @param props {{
 *     imageName: string,
 *     borderType: number,
 *     placeholderType: number,
 *     alt: string
 * }}
 * @return {*}
 * @constructor
 */
let RoundedSmallImage = props => {
    let borderClass = ""
    switch(props.borderType) {
        case BORDER_PRIMARY:
            borderClass = " friendsIcon border-primary "
            break
        default: break
    }
    let placeholderIcon = " fas fa-"
    switch(props.placeholderType) {
        case PLACEHOLDER_USER_CIRCLE:
            placeholderIcon += "user-circle "
            break
        case PLACEHOLDER_IMAGE:
            placeholderIcon += "image "
            break
        default:
            placeholderIcon = ""
            break
    }
    let imgClass = " img-fluid border rounded-circle avatar-size" + borderClass
    let placeholderClass = " avatar-size rounded-circle d-flex justify-content-center align-items-center border " + borderClass

    return (
        props.imageName ?
        <img src={ApiService.getAvatarUrl(props.imageName)}
             className={imgClass}
             alt={props.alt}
        /> :
        <div className={placeholderClass}>
            <em className={placeholderIcon + " fa-3x "}></em>
        </div>
    )
}

/**
 * @param props {{
 *     borderType: number
 * }}
 * @return {*}
 * @constructor
 */
let EmptyAvatar = props => {
    let borderClass = ""
    switch(props.borderType) {
        case BORDER_PRIMARY:
            borderClass = " friendsIcon border-primary "
            break
        default: break
    }
    return (
        <div className={" avatar-size border rounded-circle " + borderClass}></div>
    )
}

export {ImageForCard, AVATAR, IMAGE, RoundedSmallImage, BORDER_PRIMARY, EmptyAvatar, PLACEHOLDER_IMAGE, PLACEHOLDER_USER_CIRCLE, LOCAL}