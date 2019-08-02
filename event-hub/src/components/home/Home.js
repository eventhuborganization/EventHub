import React from 'react';
import './Home.css';
import EventCard from "../event_card/EventCard";
import {CreateNewEventButton} from "../floating_button/FloatingButton";
import {SEARCH_BY_EVENT, SearchBar} from "../search_bar/SearchBar";
import ApiService from '../../services/api/Api'
import NoItemsPlaceholder from "../no_item_placeholder/NoItemsPlaceHolder";

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventsLoaded: []
        }
    }

    componentDidMount() {
        ApiService.getEvents({fromIndex: 0, event: {/*fromDate: new Date(), public: true*/typology: "sport"}},
            error => this.props.onError("Errore nel caricare gli eventi. Ricaricare la pagina."),
            response => this.onSearchResults({events: response}))
    }

    onSearchResults = response => {
        if (response && response.events)
            this.setState((prevState, props) => {
                let state = prevState
                //state.eventsLoaded = response.events
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
                               city: true
                           }}
                           onError={this.props.onError}
                />

                <CreateNewEventButton location={this.props.location} />

                <main className="main-container">
                    {
                        this.state.eventsLoaded.map(event =>
                            <EventCard key={event._id}
                                       eventInfo={event}
                                       onError={this.props.onError}
                                       isLogged={this.props.isLogged}
                                       location={this.props.location}
                            />)
                    }
                    {this.renderNoNotificationPlaceHolder()}
                </main>
            </div>
        )
    }
}

export default Home