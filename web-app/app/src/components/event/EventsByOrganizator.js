import React from 'react'
import EventCard from "../event_card/EventCard"
import { CreateNewEventButton } from "../floating_button/FloatingButton"
import { SimpleSearchBar } from "../search_bar/SearchBar"
import ApiService from '../../services/api/Api'
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder"
import { LoginRedirect } from '../redirect/Redirect'
import LoadingSpinner from '../loading_spinner/LoadingSpinner'

export default class EventsByOrganizator extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            filter: "",
            displayEvents: true,
            eventsLoaded: []
        }
        if((props.isLocalUser && props.isLogged) || !props.isLocalUser) {
            ApiService.getEventsByOrganizator(
                props.organizator._id,
                error => this.onSearchError(error),
                response => {
                    if (response.length <= 0)
                        this.setState({displayEvents: false})
                    else
                        this.setState({eventsLoaded: response})
                })
        }
    }

    onSearchError = error => {
        this.setState(
            { displayEvents: false },
            () => {
                if (error.response && error.response.status !== 404) {
                    this.props.onError("Errore nel prendere i dati, ricarica.")
                }
            })
    }

    renderEvents = () => {
        if (this.state.displayEvents && this.state.eventsLoaded.length > 0) {
            return this.state.eventsLoaded
                .filter(event => event.name.toLowerCase().includes(this.state.filter.toLowerCase()))
                .map(event => 
                    <EventCard {...this.props}
                        user={this.props.organizator}
                        key={event._id}
                        eventInfo={event}
                    />
                )
        } else if(this.state.displayEvents) {
            return <LoadingSpinner />  
        } else {
            let message = this.props.isLocalUser ?
                "Non hai creato nessun evento al momento"
                : "L'organizzatore non ha ancora creato un evento"
            return <NoItemsPlaceholder placeholder={message} />
        }
    }

    renderTitle = () => {
        return this.props.isLocalUser ?
                "I miei eventi"
                : "Gli eventi di " + this.props.organizator.name
    }

    onFilterChange = (event) => {
        this.setState({filter: event.target.value})
    }

    render() {
        return (
            <div className="main-container">

                <LoginRedirect {...this.props} redirectIfNotLogged={this.props.isLocalUser} />

                <section className="row sticky-top shadow bg-white border-bottom border-primary">

                    <div className="col-12">
                        <div 
                            data-toggle="collapse" 
                            data-target="#searchContent" 
                            aria-controls="searchContent" 
                            aria-expanded="false"
                            className="d-flex justify-content-start align-items-center" 
                            aria-label="Abilita ricerca eventi per nome">
                            <h2 className="py-2 m-0">{this.renderTitle()}</h2>
                            <div className={"ml-auto btn btn-primary"}>
                                <em className="fas fa-search" aria-hidden="true"></em>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 collapse" id="searchContent">
                        <SimpleSearchBar
                            placeholder="Cerca per nome"
                            value={this.state.filter}
                            onChange={this.onFilterChange}
                        />
                    </div>
                </section>

                

                <CreateNewEventButton location={this.props.location} isLogged={this.props.isLogged} />

                <main className="main-container">
                    { this.renderEvents() }
                </main>
            </div>
        )
    }
}