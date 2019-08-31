import React from 'react'
import GoogleApi from "../../services/google_cloud/GoogleMaps";
import ApiService from '../../services/api/Api'
import {MEETING, PARTY, SPORT} from "../event/Event";
import {CallableComponent} from "../redirect/Redirect";

let SEARCH_BY_EVENT = 0
let SEARCH_BY_PLACE = 1

/**
 * @param props {{
 *     searchBy: number,
 *     onChange: function,
 *     filters: {
 *         typology: boolean,
 *         date: boolean,
 *         location: boolean
 *     },
 *     stickyTop: boolean
 * }}
 * @returns {*}
 * @constructor
 */
class SearchBar extends CallableComponent {

    search_input_id = 'tf-search'
    btn_search_id = 'btn-search'
    location_filter_id = 'location'
    date_filter_id = 'date'
    typology_filter_id = 'typology'
    distance_filter_id = 'distance'
    location_input_placeholder = "Indirizzo, Città, ..."
    defaultDistance = 5 //km
    minDistance = 1 //km
    maxDistance = 50 //km
    configured = false

    constructor(props) {
        super(props)
        let filters = {}
        if (props.filters.typology)
            filters.typology = ""
        if (props.filters.location)
            filters.location = ""
        if (props.filters.date)
            filters.date = ""
        if (props.filters.distance)
            filters.distance = this.defaultDistance
        this.state = {
            search_value: undefined,
            filters: filters
        }
    }

    componentDidMount() {
        super.componentDidMount()
        if (!this.configured) {
            switch(this.props.searchBy) {
                case SEARCH_BY_PLACE:
                    this.configureSearchByPlace()
                    break
                case SEARCH_BY_EVENT:
                    this.configureSearchByEvent()
                    break
                default: break
            }
            this.configured = true
        }
    }

    searchInNewLocation = location => {
        this.locationChanged(location, this.searchEvents)
    }

    locationChanged = (location, callback = () => {}) => {
        if (location && location.lat && location.lng) {
            switch(this.props.searchBy) {
                case SEARCH_BY_PLACE:
                    this.setState(prevState => {
                        let state = prevState
                        state.search_value = {
                            lat: location.lat,
                            lng: location.lng
                        }
                        return state
                    }, () => callback())
                    break
                case SEARCH_BY_EVENT:
                    this.setState(prevState => {
                        let state = prevState
                        state.filters.location = {
                            lat: location.lat,
                            lng: location.lng
                        }
                        return state
                    }, () => callback())
                    break
                default: break
            }
        }
    }

    configureSearchByPlace = () => {
        GoogleApi.loadGoogleMapsScript(() => {
            let searchInput = document.getElementById(this.search_input_id)
            let searchBox = new window.google.maps.places.SearchBox(searchInput)
            searchBox.addListener('places_changed', () => {
                let places = searchBox.getPlaces()
                if (places && places.length) {
                    this.setState(
                        (prevState, props) => {
                            let state = prevState
                            state.search_value = this.placeToLocation(places[0])
                            return state
                        },
                        () => this.searchEvents())
                }
            })
        })
    }

    configureSearchByEvent = () => {
        let searchInput = document.getElementById(this.search_input_id)
        searchInput.addEventListener('change',event => {
            this.setState((prevState, props) => {
                let state = prevState
                state.search_value = event.target.value
                return state
            })
        })
        GoogleApi.loadGoogleMapsScript(() => {
            let locationFilter = document.getElementById(this.location_filter_id)
            let searchBox = new window.google.maps.places.SearchBox(locationFilter)
            searchBox.addListener('places_changed', () => {
                let places = searchBox.getPlaces()
                if (places && places.length) {
                    this.setState(
                        (prevState, props) => {
                            let state = prevState
                            state.filters.location = this.placeToLocation(places[0])
                            return state
                        }, () => this.searchEvents())
                }
            })
        })
        let searchButton = document.getElementById(this.btn_search_id)
        searchButton.addEventListener('click', event => this.searchEvents())
        searchButton.addEventListener('keyup', event => {
            if (event.keyCode === 13) {
                event.preventDefault()
                searchButton.click()
            }
        })
    }

    placeToLocation = place => {
        if (place && place.geometry && place.geometry.location) {
            let location = place.geometry.location
            return location = {
                lng: location.lng(),
                lat: location.lat()
            }
        } else {
            return undefined
        }
    }

    search = (searchApi, data, location) => {
        if (this.props.onLocationChange)
            this.props.onLocationChange(location)
        searchApi(data, error => this.props.onError(location, error), events => this.onResults(events, location))
    }

    onResults = (events, location) => {
        this.props.onChange({
            events: events,
            location: location
        })
    }

    searchEvents = () => {
        let state = this.state
        let filters = state.filters
        let data = { event: {} }
        if(filters.typology){
            data.event.typology = filters.typology
        }
        if(filters.date){
            data.event.date = {
                value: filters.date,
                operator: ">="
            }
        }
        let distance = filters.distance * 1000
        switch(this.props.searchBy) {
            case SEARCH_BY_PLACE:
                let location = state.search_value
                if (location) {
                    data.event.location = {
                        lng: location.lng,
                        lat: location.lat,
                        maxDistanceInMetres: distance
                    }
                }
                this.search(ApiService.searchNearestEvents, data, location)
                break
            case SEARCH_BY_EVENT:
                data.event.name = state.search_value
                if (filters.location) {
                    let location = filters.location
                    data.event.location = {
                        lng: location.lng,
                        lat: location.lat,
                        maxDistanceInMetres: distance
                    }
                }
                this.search(state.search_value ? ApiService.searchEvents : ApiService.getEvents, data)
                break
            default: break
        }
    }

    getSearchInputColsByType() {
        switch(this.props.searchBy) {
            case SEARCH_BY_PLACE: return " col-9 "
            case SEARCH_BY_EVENT: return " col-7 "
            default: return ""
        }
    }

    updateTypology = (event) => {
        this.updateFilterValue(event, "typology")
    }

    updateDate = (event) => {
        if(new Date(event.target.value).getFullYear() / 1000 > 1){
            this.updateFilterValue(event, "date")
        }
    }

    updateDistance = event => {
        this.updateFilterValue(event, "distance")
    }

    updateFilterValue = (event, filterName) => {
        event.persist()
        this.setState((prevState) => {
            let state = prevState
            state.filters[filterName] = event.target.value
            return state
        }, () => this.searchEvents())
    }

    renderFilters() {
        let filters = []
        if (this.props.filters.location && this.props.searchBy !== SEARCH_BY_PLACE)
            filters.push(
                <div key="location">
                    <label htmlFor={this.location_filter_id} className="m-0">Località</label>
                    <input
                        id={this.location_filter_id}
                        name={this.location_filter_id}
                        type="text"
                        className="form-control"
                        placeholder={this.location_input_placeholder}
                    />
                </div>
            )
        if (this.props.filters.typology)
            filters.push(
                <div key="typology">
                    <label className="m-0" htmlFor="typology">Typology</label>
                    <select onChange={this.updateTypology}
                            className="form-control"
                            id={this.typology_filter_id}
                            name={this.typology_filter_id}
                    >
                        <option value="">Tutti</option>
                        <option value={PARTY}>Festa</option>
                        <option value={MEETING}>Incontro</option>
                        <option value={SPORT}>Sport</option>
                    </select>
                </div>
            )
        if (this.props.filters.date)
            filters.push(
                <div key="date">
                    <label htmlFor="date" className="m-0">Data</label>
                    <input
                        id={this.date_filter_id}
                        name={this.date_filter_id}
                        type="date"
                        className="form-control"
                        onChange={this.updateDate}
                    />
                </div>
            )
        if (this.props.filters.distance)
            filters.push(
                <div key="distance">
                    <label htmlFor="distance" className="m-0">Distanza: {this.state.filters.distance}km</label>
                    <div className="d-flex justify-content-between align-items-center">
                        <span>{this.minDistance}km</span>
                        <input
                            id={this.distance_filter_id}
                            name={this.distance_filter_id}
                            type="range"
                            min={this.minDistance}
                            max={this.maxDistance}
                            defaultValue={this.defaultDistance}
                            className="form-control"
                            onChange={this.updateDistance}
                        />
                        <span>{this.maxDistance}km</span>
                    </div>
                </div>
            )
        return (
            <div className="card card-body">
                <h4>Filtri</h4>
                {filters}
                {
                    filters.length > 0 ?
                        <div className={"d-flex justify-content-end align-items-center mt-1"}>
                            <button className={"btn btn-danger"}
                                    onClick={this.clearFilters}>
                                Reset
                            </button>
                        </div> : <div/>
                }
            </div>
        )
    }

    clearFilters = () => {
        this.setState(prevState => {
            let state = prevState
            state.filters.location = ""
            state.filters.date = ""
            state.filters.typology = ""
            state.filters.distance = this.defaultDistance
            return state
        }, () => {
            let typology = document.getElementById(this.typology_filter_id)
            let date = document.getElementById(this.date_filter_id)
            let distance = document.getElementById(this.distance_filter_id)
            let location = document.getElementById(this.location_filter_id)
            if (typology)
                typology.value = "placeholder"
            if (date)
                date.value = ""
            if (distance)
                distance.value = this.defaultDistance
            if (location)
                location.value = ""
            this.searchEvents()
        })
    }

    hideFilters = () => {
        document.getElementById("filters").classList.remove("show")
    }

    getInputSearchPlaceHolder = () => {
        switch(this.props.searchBy) {
            case SEARCH_BY_EVENT: return "Nome dell'evento"
            case SEARCH_BY_PLACE: return this.location_input_placeholder
            default: return ""
        }
    }

    renderSearchButton = () => {
        switch(this.props.searchBy) {
            case SEARCH_BY_EVENT:
                return (
                    <button id={this.btn_search_id} name="btn-search" className="col ml-1 btn btn-success" type="button">
                        <em className="fas fa-search" aria-hidden="true"></em>
                    </button>
                )
            default: break
        }
    }

    render() {
        let navBarClassName = (this.props.fixedTop ? "" : " row ") +
            " navbar navbar-light bg-light px-0 border-bottom border-primary pb-1 "
        let containerClass = ""
        if (this.props.stickyTop)
            containerClass = " sticky-top "
        if (this.props.fixedTop)
            containerClass = " fixed-top "
        return (
            <div className={containerClass}>
                <nav id="search-bar" className={navBarClassName}>
                    <h1 className="col-2 navbar-brand text-primary mx-0 mb-0 font-weight-bold pb-1">EH</h1>
                    <div className="col form-inline container-fluid px-1 pb-1">
                        <div className="row w-100 mx-0 d-flex justify-content-between">
                            <label htmlFor={this.search_input_id} className="d-none">Search field</label>
                            <label htmlFor={this.btn_search_id} className="d-none">Search button</label>
                            <input id={this.search_input_id}
                                   name="tf-search"
                                   type="search"
                                   placeholder={this.getInputSearchPlaceHolder()}
                                   className={this.getSearchInputColsByType() + " form-control"}
                                   onFocus={this.hideFilters}
                            />
                            {this.renderSearchButton()}
                            <button id="btn-filter" name="btn-filter" className="col btn btn-link" type="button" data-toggle="collapse"
                                    data-target="#filters" aria-expanded="false" aria-controls="filters">
                                <em className="fas fa-sliders-h" aria-hidden="true"></em>
                            </button>
                        </div>
                    </div>
                </nav>
                <div className={"collapse w-100 " + (this.props.fixedTop ? " px-3 " : " mt-1 ")} id="filters">
                    {this.renderFilters()}
                </div>
            </div>
        )
    }
}

function SimpleSearchBar(props){
    return (
        <form className="row mb-2 sticky-top bg-white py-2" onSubmit={ev => ev.preventDefault()}>
            <label htmlFor="tf-search" className="d-none">{props.placeholder}</label>
            <input 
                className="col-11 mx-auto form-control"
                id="tf-search" 
                name="tf-search" 
                type="search" 
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}/>
        </form>
    )
}

export {SearchBar, SimpleSearchBar, SEARCH_BY_EVENT, SEARCH_BY_PLACE}