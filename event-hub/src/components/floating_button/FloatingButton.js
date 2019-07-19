import React from 'react'
import {RedirectComponent} from '../redirect/Redirect'
let ApiService = require("../../services/api/Api")

let FloatingButton = (props) => {
    let iconClass = props.iconName ? "fas fa-" + props.iconName : ""
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
            <FloatingButton iconName={"plus"} onClick={() => redirect.setRedirect(true)} />
            <RedirectComponent {...props}
                               from={props.location.pathname}
                               to={"/event/new"}
                               redirectNow={false}
                               onRef={ref => redirect = ref}
            />
        </div>
        )
}

export {CreateNewEventButton}