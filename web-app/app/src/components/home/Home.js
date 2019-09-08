import React from 'react'
import './Home.css'
import EventCard from "../event_card/EventCard"
import {CreateNewEventButton} from "../floating_button/FloatingButton"
import {SEARCH_BY_EVENT, SearchBar} from "../search_bar/SearchBar"
import ApiService from '../../services/api/Api'
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder"
import LoadingSpinner from "../loading_spinner/LoadingSpinner"

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventsLoaded: [],
            displayEvents: true
        }
        ApiService.getEvents({fromIndex: 0},
            error => this.onSearchError(null, error),
            response => {
                let events = response.filter(e => e.organizator._id !== this.props.user._id)
                this.onSearchResults({events: events})
            })
    }

    onSearchResults = response => {
        if (response && response.events && response.events.length > 0)
            this.setState({eventsLoaded: response.events})
        else 
           this.onSearchError(null, {status: 500})
    }

    onSearchError = (location, error) => {
        this.setState({eventsLoaded: [], displayEvents: false},
            () => {
                if ((error.status && error.status !== 404) || (error.response && error.response.status !== 404))
                    this.props.onError("La ricerca non ha prodotto risultati, modificare i parametri impostati e riprovare.")
            })
    }

    renderEvents = () => {
        if (this.state.displayEvents && this.state.eventsLoaded.length > 0) {
            return (
                <div className={"row"}>
                    {
                        this.state.eventsLoaded.map(event =>
                            <div className={"col-12 col-md-6 col-xl-3"}>
                                <EventCard {...this.props}
                                           key={event._id}
                                           eventInfo={event}
                                />
                            </div>)
                    }
                </div>
            )
        } else if (this.state.displayEvents) {
            return <LoadingSpinner/>
        } else {
            return <NoItemsPlaceholder placeholder={"Non ci sono eventi disponibili"} />
        }
    }

    render() {
        return (
            <div>
                <SearchBar searchBy={SEARCH_BY_EVENT}
                           onChange={this.onSearchResults}
                           filters={{
                               typology: true,
                               date: true,
                               location: true
                           }}
                           stickyTop={true}
                           onError={this.onSearchError}
                />

                <CreateNewEventButton location={this.props.location} isLogged={this.props.isLogged} />

                <main className="main-container">
                    { this.renderEvents() }
                </main>
            </div>
        )
    }
}

export default Home