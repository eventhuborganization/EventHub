import React from 'react'
import {EventsMap} from "./Maps"
import {SearchBar, SEARCH_BY_PLACE} from "../search_bar/SearchBar"
import ApiService from '../../services/api/Api'
import GeoLocation from '../../services/location/GeoLocation'

class Map extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapContainerHeight: 0,
            centerPosition: {
                lat: 0,
                lng: 0
            },
            events: []
        }
        this.setCurrentPositionAsCenter()
    }

    componentDidMount() {
        this.updateMapHeight()
        window.onorientationchange = this.updateMapHeight
    }

    updateMapHeight = () => {
        let searchBarHeight = document.getElementById('search-bar').offsetHeight
        let footerHeight = document.getElementById('footer').offsetHeight
        let mapContainerHeight = window.screen.availHeight - searchBarHeight - footerHeight
        this.setState({mapContainerHeight: mapContainerHeight})
    }

    setCurrentPositionAsCenter = () => {
        GeoLocation.getCurrentLocation(
            () => this.props.onError("Per poter usufruire della mappa è necessario condividere la propria posizione"),
            position => {
                let data = {
                    event: {
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        date: {
                            value: new Date(),
                            operator: ">="
                        }
                    }
                }
                ApiService.getEvents(data,
                    () => this.props.onError("Errore nel caricare gli eventi. Ricaricare la pagina."),
                    events => this.onSearchResults({events: events}))
                this.updateCenterPosition(position.coords.latitude, position.coords.longitude)
            }
        )
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
        if (response) {
            this.updateCenterPositionWithSearchResults(response.place)
            if (response.events) {
                this.setState((prevState) => {
                    let state = prevState
                    state.events = response.events
                    return state
                })
            }
        }
    }

    onSearchError = place => {
        this.updateCenterPositionWithSearchResults(place)
        this.props.onError("La ricerca non ha prodotto risultati, modificare i parametri impostati e riprovare.")
    }

    updateCenterPositionWithSearchResults = place => {
        if (place && place.geometry && place.geometry.location) {
            let location = place.geometry.location
            this.updateCenterPosition(location.lat(), location.lng())
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
                            onError={this.onSearchError}
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