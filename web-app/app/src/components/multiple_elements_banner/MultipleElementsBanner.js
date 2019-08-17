import React from 'react'
import './MultipleElementsBanner.css'

export default function MultipleElementsBanner(props){
    let iconClass = props.iconName ? "fas fa-" + props.iconName : ""
    return (
        <div>
            <div className="row">
                <div className="col">
                    <h6><em className={iconClass}></em> {props.title}</h6>
                </div>
            </div>
            <div className="row">
                {
                    props.elements.length > 0 ? props.elements : 
                    <div className="col-11 col-md-6 mx-auto border border-primary p-2 empty-list"> 
                        {props.emptyLabel} 
                    </div>
                }
            </div>
        </div>
    )
}