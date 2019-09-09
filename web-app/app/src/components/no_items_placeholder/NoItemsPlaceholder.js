import React from 'react'
import './NoItemsPlaceholder.css'
let NoItemsPlaceholder = props => {
    return (
        <div className="row">
            <div className={"col-11 col-md-8 mx-auto mt-2"}>
                <p className={"m-0 h4 no-items-placeholder p-2"}>{props.placeholder}</p>
            </div>
        </div>
    )
}

export default NoItemsPlaceholder