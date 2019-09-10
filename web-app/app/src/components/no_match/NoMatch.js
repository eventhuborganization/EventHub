import React from 'react'
import NoItemsPlaceholder from '../no_items_placeholder/NoItemsPlaceholder'

export default function NoMatch(){
    return (
        <div className="main-container">
            <NoItemsPlaceholder placeholder="Nessuna pagina corrisponde alla tua ricerca" />
        </div>
    )
}