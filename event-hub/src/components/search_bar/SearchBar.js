import React from 'react'
import {loadGoogleMapsScript} from "../../services/google_cloud/GoogleMaps";
import ApiService from '../../services/api/Api'
import {MEETING, PARTY, SPORT} from "../event/Event";

let SEARCH_BY_EVENT = 0
let SEARCH_BY_PLACE = 1

/**
 * @param props {object}
 * @param props.searchBy {number}
 * @param props.onChange {function}
 * @param props.filters {object}
 * @param props.filters.typology {boolean}
 * @param props.filters.date {boolean}
 * @param props.filters.city {boolean}
 * @returns {*}
 * @constructor
 */
class SearchBar extends React.Component {

    search_input_id = 'tf-search'
    btn_search_id = 'btn-search'

    constructor(props) {
        super(props)
        let filters = {}
        if (props.filters.typology)
            filters.typology = ""
        if (props.filters.city)
            filters.city = ""
        if (props.filters.date)
            filters.date = ""
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
        loadGoogleMapsScript(() => {
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
        let searchButton = document.getElementById(this.btn_search_id)
        searchButton.style.display = 'none'
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
        let searchButton = document.getElementById(this.btn_search_id)
        searchButton.addEventListener('click', event => this.searchEvents())
    }

    searchEvents = () => {
        let state = this.state
        let filters = state.filters
        let data = {
            event: {
                typology: filters.typology,
                date: filters.date,
            }
        }
        let response = {}
        switch(this.props.searchBy) {
            case SEARCH_BY_PLACE:
                if (state.search_value) {
                    let place = state.search_value
                    let location = place.geometry.location
                    data.event.location = {
                        lng: location.lng,
                        lat: location.lat,
                        place_id: place.place_id,
                        address: place.address
                    }
                    response.place = place
                }
                break
            case SEARCH_BY_EVENT:
                data.event.name = state.search_value
                data.event.location = {
                    city: filters.city
                }
                break
            default: break
        }
        ApiService.searchEvents(data,
            error => this.props.onError("Errore durante la ricerca. Riprovare."),
            res => {
                response.events = res.data
                this.props.onChange(response)
            })
    }

    getSearchInputColsByType() {
        switch(this.props.searchBy) {
            case SEARCH_BY_PLACE: return " col-10 "
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

    updateCity = (event) => {
        this.updateFilterValue(event, "city")
    }

    updateFilterValue = (event, filterName) => {
        event.persist()
        this.setState((prevState, props) => {
            let state = prevState
            state.filters[filterName] = event.target.value
            return state
        }, () => this.searchEvents())
    }

    loadFilters() {
        let filters = []
        if (this.props.filters.typology)
            filters.push(
                <div key="typology">
                    <label className="m-0" htmlFor="typology">Typology</label>
                    <select defaultValue={"placeholder"}
                            onChange={this.updateTypology}
                            className="form-control"
                            id="typology">
                        <option value="placeholder" disabled hidden>Type</option>
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
        if (this.props.filters.city && this.props.searchBy !== SEARCH_BY_PLACE)
            filters.push(
                <div key="city">
                    <label htmlFor="city" className="m-0">Città</label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        className="form-control"
                        onChange={this.updateCity}
                    />
                </div>
            )
        return (
            <div className="card card-body">
                <h4>Filtri</h4>
                {filters}
            </div>
        )
    }

    hideFilters = () => {
        document.getElementById("filters").classList.remove("show")
    }

    render() {
        return (
            <nav id="search-bar" className="sticky-top row navbar navbar-light bg-light px-0 border-bottom border-primary pb-0">
                <h1 className="col-2 navbar-brand text-primary mx-0 mb-0 font-weight-bold pb-1">EH</h1>
                <div className="col form-inline container-fluid px-1 pb-1">
                    <div className="row w-100 mx-0 d-flex justify-content-between">
                        <label htmlFor={this.search_input_id} className="d-none">Search field</label>
                        <label htmlFor={this.btn_search_id} className="d-none">Search button</label>
                        <input id={this.search_input_id} name="tf-search" type="search" placeholder="Cerca qualcosa"
                               className={this.getSearchInputColsByType() + " form-control"}
                                onFocus={this.hideFilters}/>
                        <button id={this.btn_search_id} name="btn-search" className="col ml-1 btn btn-success" type="button">
                            <em className="fas fa-search" aria-hidden="true"></em>
                        </button>
                        <button id="btn-filter" name="btn-filter" className="col btn btn-link" type="button" data-toggle="collapse"
                                data-target="#filters" aria-expanded="false" aria-controls="filters">
                            <em className="fas fa-sliders-h" aria-hidden="true"></em>
                        </button>
                    </div>
                </div>
                <div className="collapse w-100" id="filters">
                    {this.loadFilters()}
                </div>
            </nav>
        )
    }
}

export {SearchBar, SEARCH_BY_EVENT, SEARCH_BY_PLACE}