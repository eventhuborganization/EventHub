import React from 'react'
import {EventsMap} from "./Maps";

class Map extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapContainerHeight: 0,
            centerPosition: {
                lat: 0,
                lng: 0
            },
            events: [
                {
                    _id: "4",
                    name: "Evento della madonna",
                    description: "Una madonna madonnesca",
                    typology: "party",
                    thumbnail: "campo-calcio.png",
                    organizator: {
                        name: "Pippo"
                    },
                    maxParticipants: 100,
                    numParticipants: 37,
                    location: {
                        lat: 44.350613499999996,
                        lng: 11.7188277
                    },
                    date: "12/08/2019",
                    time: "21:00",
                    address: "Via Santerno, 3"
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
                    numParticipants: 37,
                    location: {
                        lat: 44.350913499999996,
                        lng: 11.7182277
                    },
                    date: "12/08/2019",
                    time: "21:00",
                    address: "Via Santerno, 3"
                },
                {
                    _id: "4",
                    name: "Evento della madonna",
                    description: "Una madonna madonnesca",
                    typology: "meeting",
                    thumbnail: "campo-calcio.png",
                    organizator: {
                        name: "Pippo"
                    },
                    maxParticipants: 100,
                    numParticipants: 37,
                    location: {
                        lat: 44.350513499999996,
                        lng: 11.7182277
                    },
                    date: "12/08/2019",
                    time: "21:00",
                    address: "Via Santerno, 3"
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
                    numParticipants: 37,
                    location: {
                        lat: 44.350113499999996,
                        lng: 11.7182277
                    },
                    date: "12/08/2019",
                    time: "21:00",
                    address: "Via Santerno, 3"
                }
            ]
        }
        //console.log("construct")
        this.setCurrentPositionAsCenter()
    }

    componentDidMount() {
        let searchBarHeight = document.getElementById('search-bar').offsetHeight
        let footerHeight = document.getElementById('footer').offsetHeight
        let mapContainerHeight = window.screen.availHeight - searchBarHeight - footerHeight
        let state = this.state
        state.mapContainerHeight = mapContainerHeight
        this.setState(state)
    }

    setCurrentPositionAsCenter = () => {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                position => {
                    this.updateCenterPosition(position.coords.latitude, position.coords.longitude)
                },
                error => {
                    this.props.onError("Per poter usufruire della mappa è necessario condividere la propria posizione")
                }
            )
        }
    }

    updateCenterPosition = (lat, lng) => {
        let state = this.state
        state.centerPosition = {
            lat: lat,
            lng: lng
        }
        this.setState(state)
    }

    render() {
        return (
             <div>
                 <nav id="search-bar" className="sticky-top row navbar navbar-light bg-light border-bottom border-primary px-0">
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
                 <div className="row">
                     <div id="map-container" className="col-12 px-0" style={{height: this.state.mapContainerHeight}}>
                         <EventsMap centerPosition={this.state.centerPosition} events={this.state.events} />
                     </div>
                 </div>
             </div>
         )
    }
}

export default Map