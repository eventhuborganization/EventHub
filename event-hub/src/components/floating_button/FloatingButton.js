import React from 'react'

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
    return (<FloatingButton iconName={"plus"} onClick={() => {}} />)
}

export {CreateNewEventButton}