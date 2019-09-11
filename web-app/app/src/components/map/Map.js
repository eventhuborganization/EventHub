import React from 'react'
import {EventsMap} from "./Maps"
import {SearchBar, SEARCH_BY_PLACE, SEARCH_BAR} from "../search_bar/SearchBar"
import GeoLocation from "../../services/location/GeoLocation";
import {
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    FloatingButton,
    ROUNDED_CIRCLE,
    SQUARE
} from "../floating_button/FloatingButton"
import LocalStorage from "local-storage"
import ResizeService from "../../services/Resize/Resize"

class Map extends React.Component {

    #mapDataLocalStorageName = "map-data"
    code = undefined
    mobileBar = "mobileBar"
    desktopBar = "desktopBar"

    constructor(props) {
        super(props)
        let data = LocalStorage(this.#mapDataLocalStorageName)
        let events = []
        if (data && data.events)
            events = data.events
        this.state = {
            mapContainerHeight: 0,
            events: events,
            searchBarRefs: {},
            mapRef: undefined,
            center: {
                lat: 0,
                lng: 0
            },
            searchBarData: {
                searchBy: SEARCH_BY_PLACE,
                onSearchResults: this.onSearchResults,
                filters: {
                    typology: true,
                    date: true,
                    distance: true
                },
                filtersOnlyFixedTop: true,
                onSearchError: this.onSearchError,
                onLocationChange: this.updateCenterPositionWithSearchResults
            }
        }
        LocalStorage(this.#mapDataLocalStorageName, {
            events: this.state.events
        })
    }

    componentDidMount() {
        let searchBarData = {...this.state.searchBarData}
        searchBarData.onSearchError = this.onSearchError
        searchBarData.onRef = ref => {
            console.log(ref)
            this.updateSearchBarRef(this.desktopBar, ref)
        }
        this.props.setSearchBar(SEARCH_BAR, searchBarData)
        this.onResize()
        this.code = ResizeService.addSubscription(() => this.onResize())
        this.setCurrentPositionAsCenter()
    }

    componentWillUnmount() {
        this.props.unsetSearchBar()
        if (this.code >= 0)
            ResizeService.removeSubscription(this.code)
    }

    setCurrentPositionAsCenter = () => {
        GeoLocation.getCurrentLocation(
            () => this.props.onError("Per poter usufruire della mappa è necessario condividere la propria posizione"),
            position => {
                console.log(position)
                let location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                this.setState({center: location}, () => this.searchInNewLocation(location))
            }
        )
    }

    searchInNewLocation = location => {
        if(window.innerWidth < 1200 && this.state.searchBarRefs[this.mobileBar])
            this.state.searchBarRefs[this.mobileBar].searchInNewLocation(location)
        else if (this.state.searchBarRefs[this.desktopBar])
            this.state.searchBarRefs[this.desktopBar].searchInNewLocation(location)
    }

    searchInMapLocation = () => {
        if (this.state.mapRef)
            this.searchInNewLocation(this.state.mapRef.getCurrentPosition())
    }

    onResize = () => {
        let elements = Array.from(document.querySelectorAll(".bar-container"))
            .filter(elem => window.getComputedStyle(elem).display !== "none")
        let searchBarHeight = elements.length > 0 ? elements[0].offsetHeight : 0
        let footerHeight = document.getElementById('footer').offsetHeight
        let mapContainerHeight = window.innerHeight - searchBarHeight - footerHeight
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

    onCenterChanged = location => {
        if(window.innerWidth < 1200 && this.state.searchBarRefs[this.mobileBar])
            this.state.searchBarRefs[this.mobileBar].locationChanged(location)
        else if (this.state.searchBarRefs[this.desktopBar])
            this.state.searchBarRefs[this.desktopBar].locationChanged(location)
    }

    updateSearchBarRef = (id, ref) => {
        this.setState(prevState => {
            prevState.searchBarRefs[id] = ref
            return prevState
        }, () => this.setCurrentPositionAsCenter())
    }

    render() {
        return (
             <div>
                 <SearchBar  searchBy={SEARCH_BY_PLACE}
                             onChange={this.onSearchResults}
                             filters={{
                                 typology: true,
                                 date: true,
                                 distance: true
                             }}
                             filtersOnlyFixedTop={true}
                             onError={this.onSearchError}
                             onLocationChange={this.updateCenterPositionWithSearchResults}
                             onRef={ref => this.updateSearchBarRef(this.mobileBar, ref)}
                 />
                 <div className="row">
                     <div id="map-container"
                          className="col-12 px-0"
                          style={{height: this.state.mapContainerHeight}}
                     >
                         <EventsMap center={this.state.center}
                                    events={this.state.events}
                                    onRef={ref => this.setState({mapRef: ref})}
                                    onCenterChanged={this.onCenterChanged}
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
                 <FloatingButton icon={{name: "crosshairs", size:"2x"}}
                                 show={true}
                                 onClick={this.setCurrentPositionAsCenter}
                                 position={BOTTOM_RIGHT}
                                 shape={ROUNDED_CIRCLE}
                                 invertedColors={true}
                 />
             </div>
         )
    }
}

export default Map