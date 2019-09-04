import React from 'react'
import EventCard from "../event_card/EventCard"
import { CreateNewEventButton } from "../floating_button/FloatingButton"
import { SimpleSearchBar } from "../search_bar/SearchBar"
import ApiService from '../../services/api/Api'
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder"
import { LoginRedirect } from '../redirect/Redirect'

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
                    this.onSearchResults({events: response})
                })
        }
    }

    onSearchResults = response => {
        if (response && response.events)
            this.setState((prevState) => {
                let state = prevState
                state.eventsLoaded = response.events
                return state
            })
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
        if (this.state.displayEvents) {
            return this.state.eventsLoaded
                .filter(event => event.name === this.state.filter)
                .map(event =>
                    <EventCard {...this.props}
                            key={event._id}
                            eventInfo={event}
                    />
                )
        } else {
            let message = this.props.isLocalUser ?
                "Non hai creato nessun evento al momento"
                : "L'organizzatore non ha ancora creato un evento"
            return <NoItemsPlaceholder placeholder={message} />
        }
    }

    onFilterChange = (event) => {
        this.setState({filter: event.target.value})
    }

    render() {
        return (
            <div className="main-container">

                <LoginRedirect {...this.props} redirectIfNotLogged={this.props.isLocalUser} />

                <SimpleSearchBar
                    placeholder="Cerca evento"
                    value={this.state.filter}
                    onChange={this.onFilterChange}
                />

                <CreateNewEventButton location={this.props.location} isLogged={this.props.isLogged} />

                <main className="main-container">
                    { this.renderEvents() }
                </main>
            </div>
        )
    }
}