import React from 'react'
import './FloatingButton.css'
import {Link} from "react-router-dom";

let TOP_CENTER = 0
let BOTTOM_RIGHT = 1

let SQUARE = 0
let ROUNDED = 1
let ROUNDED_CIRCLE = 2

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
    let className = "btn btn-lg d-flex justify-content-center align-items-center px-2 " + btnClass + shape
    let renderContent = () => {
        if (props.icon && props.icon.name) {
            let iconClass = "fas fa-" + props.icon.name + (props.icon.size ? " fa-" + props.icon.size : "")
            return <em className={iconClass + " d-flex justify-content-center align-items-center"} aria-hidden="true" style={{height: 40, width: 40}}></em>
        } else if (props.text) {
            return <span className={" d-flex justify-content-center align-items-center"}>{props.text}</span>
        }
    }
    return props.show ? (
        <div className={posClass}>
            <button className={className}
                    type="button"
                    onClick={props.onClick}>
                {renderContent()}
            </button>
        </div>
    ) : <div/>
}

let CreateNewEventButton = (props) => {
    return (
        <Link to={"/event/new"}>
            <FloatingButton icon={{name: "plus", size:"2x"}} show={props.isLogged} position={BOTTOM_RIGHT} shape={ROUNDED_CIRCLE} />
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

export {
    CreateNewEventButton,
    ConfirmButton,
    FloatingButton,
    TOP_CENTER,
    BOTTOM_RIGHT,
    ROUNDED,
    ROUNDED_CIRCLE,
    SQUARE
}