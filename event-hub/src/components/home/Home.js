import React from 'react';
import './Home.css';
import EventCard from "../event_card/EventCard";
import {CreateNewEventButton} from "../floating_button/FloatingButton";

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

    render() {
        return (
            <div>
                <nav className="sticky-top row navbar navbar-light bg-light border-bottom border-primary px-0">
                    <h1 className="col-2 navbar-brand text-primary mx-0 mb-0 font-weight-bold">EH</h1>
                    <form className="col form-inline container-fluid px-1">
                        <div className="row w-100 mx-0 d-flex justify-content-between">
                            <label htmlFor="tf-search" className="d-none">Search field</label>
                            <label htmlFor="btn-search" className="d-none">Search button</label>
                            <input id="tf-search" name="tf-search" type="search" placeholder="Cerca qualcosa" className="col-7 form-control"/>
                            <button id="btn-search" name="btn-search" className="col ml-1 btn btn-success" type="submit">
                                <em className="fas fa-search" aria-hidden="true"></em>
                            </button>
                            <button id="btn-filter" name="btn-filter" className="col btn btn-link" type="button">
                                <em className="fas fa-sliders-h" aria-hidden="true"></em>
                            </button>
                        </div>
                    </form>
                </nav>

                <CreateNewEventButton location={this.props.location} />

                <main className="main-container">
                    {
                        this.state.eventsLoaded.map(event =>
                            <EventCard key={event._id}
                                       mainServer={this.props.mainServer}
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