import React from 'react'
import './FloatingButton.css'
import {Link} from "react-router-dom"

let TOP_CENTER = 0
let BOTTOM_RIGHT = 1
let BOTTOM_LEFT = 2

let SQUARE = 0
let ROUNDED = 1
let ROUNDED_CIRCLE = 2

let routes = require("../../services/routes/Routes")

/**
 *
 * @param props: {
 *     icon: {
 *         name: String,
 *         size: String
 *     },
 *     onClick: event => {}
 * }
 * @returns {*}
 * @constructor
 */
let FloatingButton = (props) => {
    let posClass = ""
    switch(props.position) {
        case TOP_CENTER:
            posClass = " fixed-top floating-button-top-center d-flex justify-content-center align-items-center "
            break
        case BOTTOM_RIGHT:
            posClass = " fixed-bottom floating-button "
            break
        case BOTTOM_LEFT:
            posClass = " fixed-bottom floating-button-bottom-left "
            break
        default: break
    }
    let shape = ""
    switch(props.shape) {
        case SQUARE:
            break
        case ROUNDED:
            shape = " rounded "
            break
        case ROUNDED_CIRCLE:
            shape = " rounded-circle "
            break
        default: break
    }
    let btnClass = props.invertedColors ? " btn-inverted-primary " : " btn-primary "
    let className = "btn btn-lg d-flex justify-content-center align-items-center px-2 " + btnClass + shape + posClass
    let renderContent = () => {
        if (props.icon && props.icon.name) {
            let iconClass = "fas fa-" + props.icon.name + (props.icon.size ? " fa-" + props.icon.size : "")
            return <em className={iconClass + " d-flex justify-content-center align-items-center floating-button-icon"} aria-hidden="true"></em>
        } else if (props.text) {
            return <span className={" d-flex justify-content-center align-items-center floating-button-text"}>{props.text}</span>
        }
    }
    return props.show ? (
            <button className={className}
                    type="button"
                    onClick={props.onClick}>
                {renderContent()}
            </button>
    ) : <div/>
}

let CreateNewEventButton = (props) => {
    return (
        <Link className={"d-xl-none"} to={routes.newEvent}>
            <FloatingButton icon={{name: "plus", size:"2x"}} show={props.isLogged} position={BOTTOM_RIGHT} shape={ROUNDED_CIRCLE} />
        </Link>
        )
}

let CreateNewGroupButton = () => {
    return (
        <Link className={"d-xl-none"} to={routes.newGroup}>
            <FloatingButton icon={{name: "plus", size:"2x"}} show={true} position={BOTTOM_RIGHT} shape={ROUNDED_CIRCLE} />
        </Link>
        )
}

/**
 *
 * @param props: {function}
 * @returns {*}
 * @constructor
 */
let ConfirmButton = (props) => {
    return (<FloatingButton icon={{name: "check", size:"2x"}} onClick={props.onClick} show={true} position={BOTTOM_RIGHT} shape={ROUNDED_CIRCLE} />)
}

let LargeFloatingButton = props => {
    return (
        <button className="fixed-bottom btn btn-primary large-floating-btn floating-button-text"
                onClick={props.onClick}
                type={props.isSubmit ? "submit" : "button"}
        >
            {props.text}
        </button>
    )
}

export {
    CreateNewEventButton,
    CreateNewGroupButton,
    ConfirmButton,
    FloatingButton,
    LargeFloatingButton,
    TOP_CENTER,
    BOTTOM_RIGHT,
    ROUNDED,
    ROUNDED_CIRCLE,
    SQUARE,
    BOTTOM_LEFT
}