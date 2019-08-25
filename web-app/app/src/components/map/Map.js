import React from 'react'
import {EventsMap} from "./Maps"
import {SearchBar, SEARCH_BY_PLACE} from "../search_bar/SearchBar"
import GeoLocation from "../../services/location/GeoLocation";
import {
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    FloatingButton,
    ROUNDED_CIRCLE,
    SQUARE
} from "../floating_button/FloatingButton";

class Map extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapContainerHeight: 0,
            events: [],
            searchBarRef: undefined,
            mapRef: undefined,
            center: {
                lat: 0,
                lng: 0
            }
        }
    }

    componentDidMount() {
        this.updateMapHeight()
        window.onorientationchange = this.updateMapHeight
        this.setCurrentPositionAsCenter()
    }

    setCurrentPositionAsCenter = () => {
        GeoLocation.getCurrentLocation(
            () => this.props.onError("Per poter usufruire della mappa è necessario condividere la propria posizione"),
            position => {
                let location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                this.setState({center: location}, () => this.searchInNewLocation(location))
            }
        )
    }

    searchInNewLocation = location => {
        if(this.state.searchBarRef)
            this.state.searchBarRef.locationChanged(location)
    }

    searchInMapLocation = () => {
        if (this.state.mapRef)
            this.searchInNewLocation(this.state.mapRef.getCurrentPosition())
    }

    updateMapHeight = () => {
        let searchBarHeight = document.getElementById('search-bar').offsetHeight
        let footerHeight = document.getElementById('footer').offsetHeight
        let mapContainerHeight = window.screen.height - searchBarHeight - footerHeight
        this.setState({mapContainerHeight: mapContainerHeight})
    }

    onSearchResults = response => {
        if (response) {
            if (response.events) {
                this.setState((prevState) => {
                    let state = prevState
                    state.events = response.events
                    return state
                }, () => this.updateCenterPositionWithSearchResults(response.location))
            }
        }
    }

    onSearchError = location => {
        this.setState({events: []}, () => this.updateCenterPositionWithSearchResults(location))
    }

    updateCenterPositionWithSearchResults = location => {
        if (location && location.lat && location.lng)
            this.setState({
                center: {
                    lat: location.lat,
                    lng: location.lng
                }
            })

    }

    render() {
        return (
             <div>
                 <SearchBar searchBy={SEARCH_BY_PLACE}
                            onChange={this.onSearchResults}
                            filters={{
                                typology: true,
                                date: true,
                                distance: true
                            }}
                            onError={this.onSearchError}
                            onLocationChange={this.updateCenterPositionWithSearchResults}
                            onRef={ref => this.setState({searchBarRef: ref})}
                 />
                 <div className="row">
                     <div id="map-container" className="col-12 px-0" style={{height: this.state.mapContainerHeight}}>
                         <EventsMap center={this.state.center}
                                    events={this.state.events}
                                    onRef={ref => this.setState({mapRef: ref})}
                         />
                     </div>
                 </div>
                 <FloatingButton text={"Cerca in quest'area"}
                                 show={true}
                                 invertedColors={true}
                                 onClick={this.searchInMapLocation}
                                 position={BOTTOM_LEFT}
                                 shape={SQUARE}
                 />
                 <FloatingButton icon={{name: "dot-circle", size:"2x"}}
                                 show={true}
                                 onClick={this.setCurrentPositionAsCenter}
                                 position={BOTTOM_RIGHT}
                                 shape={ROUNDED_CIRCLE}
                 />
             </div>
         )
    }
}

export default Map