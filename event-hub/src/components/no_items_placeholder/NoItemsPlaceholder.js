import React from 'react'
import './NoItemsPlaceholder.css'
let NoItemsPlaceholder = props => {
    return (
        <div className="row">
            <div className={"col-12 px-2 mt-2"}>
                <p className={"m-0 h3 no-items-placeholder"}>{props.placeholder}</p>
            </div>
        </div>
    )
}

export default NoItemsPlaceholder