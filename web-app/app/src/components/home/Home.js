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
            () => this.props.onError("Errore nel caricare gli eventi. Ricaricare la pagina."),
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
                           onError={this.props.onError}
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