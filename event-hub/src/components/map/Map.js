import React from 'react'
import {EventsMap} from "./Maps"
import {SearchBar, SEARCH_BY_PLACE} from "../search_bar/SearchBar"

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
                    _id: "1",
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
                    _id: "2",
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
                    _id: "3",
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

    onSearchResults = response => {
        if (response && response.place) {
            if (response.place) {
                let location = response.place.geometry.location
                this.updateCenterPosition(location.lat(), location.lng())
            }
            if (response.events) {
                this.setState((prevState, props) => {
                    let state = prevState
                    state.events = response.events
                    return state
                })
            }
        }
    }

    render() {
        return (
             <div>
                 <SearchBar searchBy={SEARCH_BY_PLACE}
                            onChange={this.onSearchResults}
                            filters={{
                                typology: true,
                                date: true
                            }}
                            onError={this.props.onError}
                 />
                 <div className="row">
                     <div id="map-container" className="col-12 px-0" style={{height: this.state.mapContainerHeight}}>
                         <EventsMap centerPosition={this.state.centerPosition}
                                    events={this.state.events} />
                     </div>
                 </div>
             </div>
         )
    }
}

export default Map