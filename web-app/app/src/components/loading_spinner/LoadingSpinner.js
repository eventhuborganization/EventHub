import React from 'react'
import './LoadingSpinner.css'

export default function LoadingSpinner(){
    return (
        <div className={"main-container text-center loading-container"}>
                <div className="spinner-border text-primary" id="spinner-loading" role="status">
                    <span className="sr-only">Caricamento...</span>
                </div>
        </div>
    )
} 