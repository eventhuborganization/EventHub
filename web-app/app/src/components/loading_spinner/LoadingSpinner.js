import React from 'react'
import './LoadingSpinner.css'

export default function LoadingSpinner(props){
    return (
        <div className={"main-container text-center loading-container " + (props.personalizedMargin ? props.personalizedMargin : "")}>
                <div className="spinner-border text-primary" id="spinner-loading" role="status">
                    <span className="sr-only">Caricamento...</span>
                </div>
        </div>
    )
} 