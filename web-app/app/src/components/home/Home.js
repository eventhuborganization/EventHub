import React from 'react';
import './Home.css';
import EventCard from "../event_card/EventCard";
import {CreateNewEventButton} from "../floating_button/FloatingButton";
import {SEARCH_BY_EVENT, SearchBar} from "../search_bar/SearchBar";
import ApiService from '../../services/api/Api'
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder";

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventsLoaded: []
        }
        ApiService.getEvents({fromIndex: 0},
            error => this.onSearchError(null, error),
            response => this.onSearchResults({events: response}))
    }

    onSearchResults = response => {
        if (response && response.events)
            this.setState((prevState) => {
                let state = prevState
                state.eventsLoaded = response.events
                return state
            })
    }

    onSearchError = (location, error) => {
        this.setState({eventsLoaded: []},
            () => {
                if ((error.status && error.status !== 404) || (error.response && error.response.status !== 404))
                    this.props.onError("La ricerca non ha prodotto risultati, modificare i parametri impostati e riprovare.")
            })
    }

    renderNoNotificationPlaceHolder = () => {
        if (this.state.eventsLoaded.length <= 0)
            return <NoItemsPlaceholder placeholder={"Non ci sono eventi disponibili"} />
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
                    {
                        this.state.eventsLoaded.map(event =>
                            <EventCard {...this.props}
                                       key={event._id}
                                       eventInfo={event}
                            />)
                    }
                    {this.renderNoNotificationPlaceHolder()}
                </main>
            </div>
        )
    }
}

export default Home