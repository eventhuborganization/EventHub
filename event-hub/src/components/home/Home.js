import React from 'react';
import './Home.css';
import EventCard from "../event_card/EventCard";
import {CreateNewEventButton} from "../floating_button/FloatingButton";
import {SEARCH_BY_EVENT, SearchBar} from "../search_bar/SearchBar";
import ApiService from '../../services/api/Api'

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventsLoaded: []
        }
    }

    componentDidMount() {
        ApiService.getEvents({fromIndex: 0},
            error => this.props.onError("Errore nel caricare gli eventi. Ricaricare la pagina."),
            response => { console.log(response); this.onSearchResults({events: response.data})})
    }

    onSearchResults = response => {
        if (response && response.events)
            this.setState((prevState, props) => {
                let state = prevState
                state.eventsLoaded = response.events.map(event => {
                    return {
                        creationDate: event.creationDate,
                        date: event.date,
                        description: event.description,
                        followers: event.followers,
                        maxParticipants: event.maximumParticipants,
                        name: event.name,
                        organizator: event.organizator,
                        participants: event.participants,
                        numParticipants: event.participants.length,
                        public: event.public,
                        reviews: event.reviews,
                        typology: event.typology,
                        _id: event._id
                    }
                })
                return state
            })
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
                </main>
            </div>
        )
    }
}

export default Home