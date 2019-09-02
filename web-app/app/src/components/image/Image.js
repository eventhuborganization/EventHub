import React from "react"
import ApiService from "../../services/api/Api"
import './Image.css'

let AVATAR = 0
let IMAGE = 1
let LOCAL = 2

let BORDER_PRIMARY = 0

let PLACEHOLDER_USER_CIRCLE = 0
let PLACEHOLDER_GROUP_CIRCLE = 1
let PLACEHOLDER_IMAGE = 2

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
let RoundedImage = props => {
    let borderClass = ""
    switch(props.borderType) {
        case BORDER_PRIMARY:
            borderClass = " friendsIcon border-primary "
            break
        default: break
    }
    let size = ""
    let placeholderIcon = " fas fa-"
    switch(props.placeholderType) {
        case PLACEHOLDER_USER_CIRCLE:
            placeholderIcon += "user-circle "
            size = " fa-3x"
            break
        case PLACEHOLDER_GROUP_CIRCLE:
            placeholderIcon += "users "
            size = (props.bigger ? " fa-3x" : " fa-2x")
            break
        case PLACEHOLDER_IMAGE:
            placeholderIcon += "image "
            size = " fa-3x"
            break
        default:
            placeholderIcon = ""
            size = " fa-3x"
            break
    }
    let imgClass = props.size + " img-fluid border rounded-circle " + borderClass
    let placeholderClass = props.size + " rounded-circle d-flex justify-content-center align-items-center border " + borderClass
    return (
        props.imageName ?
        <img src={ApiService.getAvatarUrl(props.imageName)}
             className={imgClass}
             alt={props.alt}
        /> :
        <div className={placeholderClass}>
            <em className={placeholderIcon + size}></em>
        </div>
    )
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
     return <RoundedImage {...props} size={"small-avatar-size"} />
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
let RoundedBigImage = props => {
    return <RoundedImage {...props} size={"big-avatar-size"} bigger={true} />
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
    let size = props.size ? props.size : "small-avatar-size"
    switch(props.borderType) {
        case BORDER_PRIMARY:
            borderClass = " friendsIcon border-primary "
            break
        default: break
    }
    return (
        <div className={size + " border rounded-circle " + borderClass}></div>
    )
}

/**
 * @param props {{
 *     borderType: number
 * }}
 * @return {*}
 * @constructor
 */
let MoreAvatar = props => {
    let borderClass = ""
    let size = props.size ? props.size : "small-avatar-size"
    switch(props.borderType) {
        case BORDER_PRIMARY:
            borderClass = " friendsIcon border-primary "
            break
        default: break
    }
    return (
        <div className={size + " d-flex justify-content-center align-items-center border rounded-circle " + borderClass}>
            <em className={"fas fa-ellipsis-h text-dark"}></em>
        </div> 
    )
}

export {
    AVATAR,
    IMAGE,
    BORDER_PRIMARY,
    PLACEHOLDER_IMAGE,
    PLACEHOLDER_USER_CIRCLE,
    PLACEHOLDER_GROUP_CIRCLE,
    LOCAL,
    ImageForCard, 
    RoundedSmallImage,
    RoundedBigImage,
    EmptyAvatar,
    MoreAvatar
}