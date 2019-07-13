import React from 'react';
import './Home.css';
import EventCard from "../event_card/EventCard";

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventsLoaded: [{
                name: "Evento della madonna",
                description: "Una madonna madonnesca",
                typology: "sport",
                thumbnail: "",
                organizator: {
                    name: "Pippo"
                },
                maxParticipants: 100,
                numParticipants: 37
            },
            {
                name: "Evento della madonna",
                description: "Una madonna madonnesca",
                typology: "incontro",
                thumbnail: "",
                organizator: {
                    name: "Pippo"
                },
                maxParticipants: 100,
                numParticipants: 37
            },
            {
                name: "Evento della madonna",
                description: "Una madonna madonnesca",
                typology: "festa",
                thumbnail: "",
                organizator: {
                    name: "Pippo"
                },
                maxParticipants: 100,
                numParticipants: 37
            },
            {
                name: "Evento della madonna",
                description: "Una madonna madonnesca",
                typology: "sport",
                thumbnail: "",
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
                    <form className="col-10 form-inline container-fluid px-1">
                        <div className="row w-100 mx-0">
                            <label htmlFor="tf-search" className="d-none">Search field</label>
                            <label htmlFor="btn-search" className="d-none">Search button</label>
                            <input id="tf-search" name="tf-search" type="search" placeholder="Cerca qualcosa"
                                   className="col-9 form-control"/>
                            <button id="btn-search" name="btn-search" className="col-auto ml-auto btn btn-success "
                                    type="submit">
                                <em className="fas fa-search" aria-hidden="true"></em>
                            </button>
                            <button id="btn-filter" name="btn-filter" className="col-auto ml-auto btn btn-link"
                                    type="submit">
                                <em className="fas fa-sliders-h" aria-hidden="true"></em>
                            </button>
                        </div>
                    </form>
                </nav>

                <button className="btn btn-lg btn-primary rounded-circle floating-button fixed-bottom" type="submit">
                    <em className="fas fa-plus" aria-hidden="true"></em>
                </button>

                <main className="main-container">
                    {
                        this.state.eventsLoaded.map(event =>
                            <EventCard mainServer={this.props.mainServer}
                                       eventInfo={event}
                                       onError={this.props.onError}
                                       isLogged={this.props.isLogged}
                            />)
                    }
                </main>
            </div>
        )
    }
}

export default Home