import React from 'react'
import {EventsMap} from "./Maps"
import {SearchBar, SEARCH_BY_PLACE} from "../search_bar/SearchBar"

class Map extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapContainerHeight: 0,
            events: [],
            searchBarRef: undefined,
            mapRef: undefined
        }
    }

    componentDidMount() {
        this.updateMapHeight()
        window.onorientationchange = this.updateMapHeight
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
        if (location && this.state.mapRef)
            this.state.mapRef.updateCenterPosition(location)

    }

    onCenterChanged = location => {
        if (this.state.searchBarRef)
            this.state.searchBarRef.locationChanged(location)
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
                         <EventsMap startAtCurrentLocation={true}
                                    events={this.state.events}
                                    onCenterChanged={this.onCenterChanged}
                                    onRef={ref => this.setState({mapRef: ref})}
                         />
                     </div>
                 </div>
             </div>
         )
    }
}

export default Map