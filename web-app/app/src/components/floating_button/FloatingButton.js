import React from 'react'
import './FloatingButton.css'
import {Link} from "react-router-dom";

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
    var iconClass = ""
    if (props.icon && props.icon.name)
        iconClass = "fas fa-" + props.icon.name + (props.icon.size ? " fa-" + props.icon.size : "")
    return props.show ? (
        <button className="btn btn-lg btn-primary rounded-circle floating-button fixed-bottom d-flex justify-content-center align-items-center px-2"
                type="button"
                onClick={props.onClick}>
            <em className={iconClass + " d-flex justify-content-center align-items-center"} aria-hidden="true" style={{height: 40, width: 40}}></em>
        </button>
    ) : ""
}

let CreateNewEventButton = (props) => {
    return (
        <Link to={"/event/new"}>
            <FloatingButton icon={{name: "plus", size:"2x"}} show={props.isLogged} />
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
    return (<FloatingButton icon={{name: "check", size:"2x"}} onClick={props.onClick} show={true}/>)
}

export {CreateNewEventButton, ConfirmButton}