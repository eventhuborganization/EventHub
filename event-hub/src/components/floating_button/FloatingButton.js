import React from 'react'

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
    return (
        <button className="btn btn-lg btn-primary rounded-circle floating-button fixed-bottom"
                type="button"
                onClick={props.onClick}>
            <em className={iconClass} aria-hidden="true"></em>
        </button>
    )
}

let CreateNewEventButton = (props) => {
    return (
        <a href={"/event/new"}>
            <FloatingButton icon={{name: "plus"}} />
        </a>
        )
}

/**
 *
 * @param props: {function}
 * @returns {*}
 * @constructor
 */
let ConfirmButton = (props) => {
    return (<FloatingButton icon={{name: "check-circle"}} onClick={props.onClick} />)
}

export {CreateNewEventButton, ConfirmButton}