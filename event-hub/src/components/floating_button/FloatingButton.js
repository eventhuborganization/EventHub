import React from 'react'
import {RedirectComponent} from '../redirect/Redirect'


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
    let redirect = undefined
    return (
        <div>
            <FloatingButton icon={{name: "plus"}} onClick={() => redirect.setRedirect(true)} />
            <RedirectComponent {...props}
                               from={props.location.pathname}
                               to={"/event/new"}
                               redirectNow={false}
                               onRef={ref => redirect = ref}
            />
        </div>
        )
}

/**
 *
 * @param props: {
 *     onClick: event => {}
 * }
 * @returns {*}
 * @constructor
 */
let ConfirmButton = (props) => {
    return (<FloatingButton icon={{name: "check-circle"}} onClick={props.onClick} />)
}

export {CreateNewEventButton, ConfirmButton}