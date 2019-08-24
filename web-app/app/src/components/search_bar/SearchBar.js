import React from 'react'
import GoogleApi from "../../services/google_cloud/GoogleMaps";
import ApiService from '../../services/api/Api'
import {MEETING, PARTY, SPORT} from "../event/Event";

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
class SearchBar extends React.Component {

    search_input_id = 'tf-search'
    btn_search_id = 'btn-search'
    location_filter_id = 'location'
    location_input_placeholder = "Indirizzo, Città, ..."
    defaultDistance = 5 //km
    minDistance = 1 //km
    maxDistance = 20 //km

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
        switch(this.props.searchBy) {
            case SEARCH_BY_PLACE:
                this.configureSearchByPlace()
                break
            case SEARCH_BY_EVENT:
                this.configureSearchByEvent()
                break;
            default: break;
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
                            state.search_value = places[0]
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
                            state.filters.location = places[0]
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

    search = (searchApi, data, place) => {
        searchApi(data, () => this.props.onError(place), events => this.onResults(events, place))
    }

    onResults = (events, place) => {
        this.props.onChange({
            events: events,
            place: place
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
        switch(this.props.searchBy) {
            case SEARCH_BY_PLACE:
                let place = state.search_value
                if (place) {
                    let location = place.geometry.location
                    data.event.location = {
                        lng: location.lng(),
                        lat: location.lat(),
                        maxDistanceInMetres: filters.distance
                    }
                }
                this.search(ApiService.searchNearestEvents, data, place)
                break
            case SEARCH_BY_EVENT:
                data.event.name = state.search_value
                if (filters.location) {
                    let location = filters.location.geometry.location
                    data.event.location = {
                        lng: location.lng(),
                        lat: location.lat(),
                        maxDistanceInMetres: filters.distance
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
        this.updateFilterValue(event, "date")
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
                        name="location"
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
                    <select defaultValue={"placeholder"}
                            onChange={this.updateTypology}
                            className="form-control"
                            id="typology"
                    >
                        <option value="placeholder" disabled hidden>Tipo</option>
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
                        id="date"
                        name="date"
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
                            id="distance"
                            name="distance"
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
                        <div className={"d-flex justify-content-end align-items-center"}>
                            <button className={"btn btn-danger"}>Reset</button>
                        </div> : <div/>
                }
            </div>
        )
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
        let navBarClassName = (this.props.stickyTop ? " sticky-top " : "")
            + " row navbar navbar-light bg-light px-0 border-bottom border-primary pb-1"
        return (
            <div>
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
                <div className="collapse w-100 my-1" id="filters">
                    {this.renderFilters()}
                </div>
            </div>
        )
    }
}

export {SearchBar, SEARCH_BY_EVENT, SEARCH_BY_PLACE}