import React from 'react';
import './Home.css';
import EventCard from "../event_card/EventCard";
import {CreateNewEventButton} from "../floating_button/FloatingButton";
import {SEARCH_BY_EVENT, SearchBar} from "../search_bar/SearchBar";

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventsLoaded: [{
                _id: "1",
                name: "Evento della madonna",
                description: "Una madonna madonnesca",
                typology: "sport",
                thumbnail: "campo-calcio.png",
                organizator: {
                    name: "Pippo"
                },
                maxParticipants: 100,
                numParticipants: 37
            },
            {
                _id: "2",
                name: "Evento della madonna",
                description: "Una madonna madonnesca",
                typology: "meeting",
                thumbnail: "concerto.jpeg",
                organizator: {
                    name: "Pippo"
                },
                maxParticipants: 100,
                numParticipants: 37
            },
            {
                _id: "3",
                name: "Evento della madonna",
                description: "Una madonna madonnesca",
                typology: "party",
                thumbnail: "party.jpg",
                organizator: {
                    name: "Pippo"
                },
                maxParticipants: 100,
                numParticipants: 37
            },
            {
                _id: "4",
                name: "Evento della madonna",
                description: "Una madonna madonnesca",
                typology: "sport",
                thumbnail: "campo-calcio.png",
                organizator: {
                    name: "Pippo"
                },
                maxParticipants: 100,
                numParticipants: 37
            }]
        }
    }

    onSearchResults = response => {
        if (response && response.events)
            this.setState((prevState, props) => {
                let state = prevState
                state.eventsLoaded = response.events
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