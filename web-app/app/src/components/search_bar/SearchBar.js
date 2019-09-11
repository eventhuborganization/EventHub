import React from 'react'
import GoogleApi from "../../services/google_cloud/GoogleMaps";
import ApiService from '../../services/api/Api'
import {MEETING, PARTY, SPORT} from "../event/Event";
import {CallableComponent} from "../redirect/Redirect"
import "./SearchBar.css"
import {Link} from "react-router-dom"
import {PLACEHOLDER_USER_CIRCLE, RoundedSmallImage} from "../image/Image";
import Menu from "../menu/Menu"
import ResizeService from "../../services/Resize/Resize"
import NotificationService from "../../services/notification/Notification"
import { createBrowserHistory } from "history"

let routes = require("../../services/routes/Routes")

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
 *     stickyTop: boolean,
 *     showAnyway: boolean,
 *     hideLogo: boolean
 * }}
 * @returns {*}
 * @constructor
 */
class SearchBar extends CallableComponent {

    rand = Math.floor(Math.random() * 100) + 1
    search_input_id = 'tf-search' + this.rand
    btn_search_id = 'btn-search' + this.rand
    location_filter_id = 'location' + this.rand
    date_filter_id = 'date' + this.rand
    typology_filter_id = 'typology' + this.rand
    distance_filter_id = 'distance' + this.rand
    location_input_placeholder = "Indirizzo, Città, ..."
    defaultDistance = 20 //km
    minDistance = 1 //km
    maxDistance = 50 //km
    configured = false
    searchBarId = "search-bar" + this.rand
    filtersContainerId = "filter-container" + this.rand
    code = -1
    lastLocation = ""

    constructor(props) {
        super(props)
        let filters = {}
        if (props.filters.typology)
            filters.typology = ""
        if (props.filters.location)
            filters.location = ""
        if (props.filters.date)
            filters.date = undefined
        if (props.filters.distance)
            filters.distance = this.defaultDistance
        this.state = {
            search_value: undefined,
            filters: filters,
            filtersMarginTop: 0,
            showDistanceMessage: false
        }
    }

    componentDidMount() {
        this.updateFiltersMarginTop()
        if (this.code < 0)
            this.code = ResizeService.addSubscription(() => this.updateFiltersMarginTop())
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

    componentDidUpdate() {
        let history = createBrowserHistory()
        if (history.location.pathname !== this.lastLocation) {
            this.lastLocation = history.location.pathname
            this.hideFilters()
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        if (this.code >= 0)
            ResizeService.removeSubscription(this.code)
    }

    updateFiltersMarginTop = () => {
        if (this.props.filtersOnlyFixedTop) {
            let elem = document.getElementById(this.props.containerId && this.props.containerId !== "" ? this.props.containerId : this.searchBarId)
            this.setState({filtersMarginTop: elem ? elem.offsetHeight : 0})
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
                    this.setState({search_value: this.placeToLocation(places[0])},() => this.searchEvents())
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
                    this.setState(prevState => {
                            let state = prevState
                            state.filters.location = this.placeToLocation(places[0])
                            return state
                        }, () => this.searchEvents())
                }
            })
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
        searchApi(data,
                error => {
                    if (this.props.onError instanceof Function)
                        this.props.onError(location, error)
                }, events => {
                        this.onResults(events, location)
                })
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
            case SEARCH_BY_PLACE: return " col "
            case SEARCH_BY_EVENT: return " col "
            default: return ""
        }
    }

    updateTypology = (event) => {
        this.updateFilterValue(event, "typology")
    }

    updateDate = (event) => {
        event.persist()
        if(new Date(event.target.value).getFullYear() / 1000 > 1) {
            this.updateFilterValue(event, "date")
        } else if (!event.target.value) {
            this.setState(prevState => {
                let state = prevState
                state.filters.date = undefined
                return state
            }, () => this.searchEvents())
        }
    }

    updateDistance = event => {
        event.persist()
        this.setState((prevState) => {
            let state = prevState
            state.filters.distance = event.target.value
            state.showDistanceMessage = true
            return state
        })
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
                <div key="location" className={"form-group"}>
                    <label htmlFor={this.location_filter_id} className="m-0">Luogo</label>
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
                <div key="typology" className={"form-group"}>
                    <label className="m-0" htmlFor="typology">Tipologia</label>
                    <select onChange={this.updateTypology}
                            className="form-control"
                            id={this.typology_filter_id}
                            name={this.typology_filter_id}
                            defaultValue={""}
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
                <div key="date" className={"form-group"}>
                    <label htmlFor="date" className="m-0">A partire dal</label>
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
                <div key="distance" className={"form-group"}>
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
                    {
                        this.state.showDistanceMessage ?
                            <p className={"m-0 text-danger text-left"}>
                                Per visualizzare le modifiche clicca su applica
                            </p> : <div/>
                    }
                </div>
            )
        return (
            <div className="card card-body">
                <h4>Filtri</h4>
                {filters}
                {
                    filters.length > 0 ?
                        <div className={"d-flex justify-content-end align-items-center"}>
                            <button className={"btn btn-danger"}
                                    type={"reset"}
                                    onClick={this.clearFilters}>
                                Cancella
                            </button>
                            {this.renderApplyButton()}
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
            state.showDistanceMessage = false
            return state
        }, () => {
            this.searchEvents()
        })
    }

    hideFilters = () => {
        let filters = document.getElementById(this.filtersContainerId)
        if (filters)
            filters.classList.remove("show")
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
                    <button id={this.btn_search_id} name="btn-search" className="col-2 col-md-1 ml-1 btn btn-success" type="submit">
                        <em className="fas fa-search" aria-hidden="true"></em>
                    </button>
                )
            default: break
        }
    }

    getContainerPositionClass = () => {
        if (this.props.stickyTop)
            return "sticky-top"
        else if (this.props.fixedTop)
            return "fixed-top"
        else
            return ""
    }

    submit = event => {
        event.preventDefault()
        this.searchEvents()
    }

    renderApplyButton = () => {
            return this.props.filters.distance ?
                    <button name="btn-apply-filters" className="btn btn-success ml-2" type="submit"
                            onClick={this.applyFilters}>
                        Applica
                    </button> : <div/>
    }

    applyFilters = () => {
        this.hideFilters()
        this.setState({showDistanceMessage: false})
    }

    renderLogo = () => {
        return this.props.hideLogo ? <div/> :
            <h1 className="col-2 navbar-brand text-primary mx-0 mb-0 font-weight-bold pb-1 logo">EH</h1>

    }

    render() {
        let navBarClassName = (this.props.fixedTop ? "" : " row ") +
            (this.props.noBorder ? "" : " border-bottom border-primary ") +
            " navbar navbar-light bg-light px-0 pb-1 "
        let containerClass = (this.props.showAnyway ? "" : " d-xl-none ") + this.getContainerPositionClass() + " bar-container "
        let filtersClass = "collapse row "
        if (this.props.filtersOnlyFixedTop)
            filtersClass += " fixed-top px-3 px-xl-0"
        return (
            <form className={containerClass} onSubmit={this.submit}>
                <nav id={this.props.containerId ? "" : this.searchBarId} className={navBarClassName}>
                    {this.renderLogo()}
                    <div className="col form-inline container-fluid px-1 pb-1">
                        <div className="row w-100 mx-0 d-flex justify-content-between">
                            <label htmlFor={this.search_input_id} className="d-none">Search field</label>
                            <label htmlFor={this.btn_search_id} className="d-none">Search button</label>
                            <input id={this.search_input_id}
                                   name="tf-search"
                                   type="search"
                                   placeholder={this.getInputSearchPlaceHolder()}
                                   className={this.getSearchInputColsByType() + " form-control input-search"}
                                   onFocus={this.hideFilters}
                            />
                            {this.renderSearchButton()}
                            <button id="btn-filter" name="btn-filter" className=" col-2 col-md-1 btn btn-link btn-filter" type="button" data-toggle="collapse"
                                    data-target={"#" + this.filtersContainerId} aria-expanded="false" aria-controls="filters">
                                <em className="fas fa-sliders-h" aria-hidden="true"></em>
                            </button>
                        </div>
                    </div>
                </nav>
                <div className={filtersClass}
                     style={{marginTop: this.state.filtersMarginTop}}
                     id={this.filtersContainerId}
                >
                    <div className={"col-12 col-xl-6 filters-container"}>
                        {this.renderFilters()}
                    </div>
                </div>
            </form>
        )
    }
}

function SimpleSearchBar(props){
    let containerClass = (props.showAnyway ? "" : " d-xl-none ") +
        (props.noStickyTop ? "" : " stickyTop bg-white ") +
        (props.noMargin ? "" : " mb-2 ") +
        " row py-2 "
    return (
        <form className={containerClass} onSubmit={ev => ev.preventDefault()}>
            <label htmlFor="tf-search" className="d-none">{props.placeholder}</label>
            <input 
                className="col-11 mx-auto form-control input-search"
                id="tf-search" 
                name="tf-search" 
                type="search" 
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}/>
        </form>
    )
}

function FriendsSearchBar(props) {
    let containerClass = (props.showAnyway ? "" : " d-xl-none ") +
        (props.noBorder ? "" : " border-bottom border-primary ") +
        (props.noStickyTop ? "" : " stickyTop ") +
        "row navbar navbar-light bg-light px-0"

    let renderLogo = () => {
        return props.hideLogo ? <div/> :
            <h1 className="col-2 navbar-brand text-primary mx-0 mb-0 font-weight-bold pb-1 logo">EH</h1>

    }
    return (
        <nav className={containerClass}>
            {renderLogo()}
            <form className="col form-inline container-fluid px-1" onSubmit={props.searchPeople}>
                <div className="row w-100 mx-0 d-flex justify-content-between">
                    <label htmlFor="tf-search" className="d-none">Cerca persona</label>
                    <label htmlFor="btn-search" className="d-none">Bottone di ricerca</label>
                    <input
                        className="col form-control input-search"
                        id="tf-search"
                        name="tf-search"
                        type="search"
                        placeholder="Cerca una persona"
                        onChange={props.onFilter}
                    />
                    <button id="btn-search" name="btn-search" className="col-2 col-md-1 ml-1 btn btn-success" type="submit">
                        <em className="fas fa-search" aria-hidden="true"></em>
                    </button>
                </div>
            </form>
        </nav>
    )
}

const SEARCH_BAR = 0
const SIMPLE_SEARCH_BAR = 1
const FRIEND_SEARCH_BAR = 2

/**
 * @param props {{
 *     data: object
 *     searchBarType: number
 *     user: object
 * }}
 * @returns {*}
 * @constructor
 */
class DesktopSearchBar extends React.Component {

    menuContainerId = "menu-container"
    containerId = "desktop-header-bar"
    code = -1
    notificationServiceSubscriptionCode = -1
    lastLocation = ""

    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            menuMarginTop: 0
        }
        if(this.props.isLogged){
            this.notificationServiceSubscriptionCode = NotificationService.addSubscription(this.onNotificationLoaded)
        }
    }

    componentDidMount() {
        this.updateMenuMarginTop()
        if (this.code < 0)
            this.code = ResizeService.addSubscription(() => this.updateMenuMarginTop())
    }

    componentDidUpdate() {
        this.updateMenuMarginTop()
        let history = createBrowserHistory()
        if (history.location.pathname !== this.lastLocation) {
            this.lastLocation = history.location.pathname
            this.hideMenu()
        }
        if (this.code < 0)
            this.code = ResizeService.addSubscription(() => this.updateMenuMarginTop())
        if(this.props.isLogged && this.notificationServiceSubscriptionCode < 0){
            this.notificationServiceSubscriptionCode = NotificationService.addSubscription(this.onNotificationLoaded)
        } else if(!this.props.isLogged && this.notificationServiceSubscriptionCode >= 0){
            this.removeSubscriptions()
        }
    }

    componentWillUnmount() {
        this.removeSubscriptions()
    }

    removeSubscriptions = () => {
        if (this.code >= 0) {
            ResizeService.removeSubscription(this.code)
            this.code = -1
        }
        if (this.notificationServiceSubscriptionCode >= 0) {
            NotificationService.removeSubscription(this.notificationServiceSubscriptionCode)
            this.setState({notifications: []})
            this.notificationServiceSubscriptionCode = -1
        }
    }

    onNotificationLoaded = (notifications) => {
        this.setState({notifications: notifications})
    }

    navBarLink = (route, elem) => {
        return (
            <Link to={route}>
                <div className="navbar-brand mx-0 mb-0 pb-1 mr-4 logo">{elem}</div>
            </Link>
        )
    }

    updateMenuMarginTop = () => {
        let elem = document.getElementById(this.containerId)
        let height = elem ? elem.offsetHeight : 0
        if (this.state.menuMarginTop !== height)
            this.setState({menuMarginTop: height})
    }

    renderNotificationBadge = () => {
        return this.props.isLogged && this.state.notifications.length > 0 ?
            <span className={"badge badge-danger align-top ml-1 notification-badge"}>{this.state.notifications.length}</span> : <div/>
    }

    renderSearchBar = () => {
        if (this.props.searchBarType < 0 || !this.props.data)
            return <div/>
        let data = this.props.data
        switch(this.props.searchBarType) {
            case SEARCH_BAR:
                return <SearchBar
                           showAnyway={true}
                           hideLogo={true}
                           noBorder={true}
                           stickyTop={false}
                           fixedTop={false}
                           filtersOnlyFixedTop={true}
                           containerId={this.containerId}
                           filters={data.filters || {}}
                           searchBy={data.searchBy}
                           onChange={data.onSearchResults}
                           onError={data.onSearchError}
                           onRef={this.props.onRef}
                        />
            case FRIEND_SEARCH_BAR:
                return <FriendsSearchBar
                            showAnyway={true}
                            hideLogo={true}
                            noBorder={true}
                            noStickyTop={true}
                            onFilter={data.onFilter}
                            searchPeople={data.searchPeople}
                        />
            case SIMPLE_SEARCH_BAR:
                return <SimpleSearchBar
                            showAnyway={true}
                            noStickyTop={true}
                            noMargin={true}
                            placeholder={data.placeholder}
                            onChange={data.onChange}
                        />
            default: return <div/>
        }
    }

    hideMenu = () => {
        let menu = document.getElementById(this.menuContainerId)
        if (menu)
            menu.classList.remove("show")
    }

    render() {
        let avatar =
            <Link to={routes.myProfile} style={{textDecoration: "none"}} >
                <RoundedSmallImage
                    imageName={this.props.user.avatar}
                    placeholderType={PLACEHOLDER_USER_CIRCLE}
                    size={"navbar-avatar"}
                />
            </Link>
        let filtersClass = "collapse row fixed-top px-3"
        return (
            <div id={this.containerId} className={"d-none d-xl-block sticky-top bar-container"}>
                <nav className=" row navbar navbar-light bg-light border-bottom border-primary px-0">
                    <div className={"col-1"}>
                        <Link to={routes.home}>
                            <h1 className="navbar-brand text-primary mx-0 mb-0 font-weight-bold pb-1 logo">EventHub</h1>
                        </Link>
                    </div>
                    <div className={"col-5"}>
                        {this.renderSearchBar()}
                    </div>
                    <div className={"col-6 d-flex justify-content-end align-items-center"}>
                        {
                            this.props.isLogged && !this.props.hideCreateEvent ?
                                this.navBarLink(routes.newEvent, <button className={"btn btn-outline-primary"}>Crea Evento</button>)
                                : <div/>
                        }
                        {this.navBarLink(routes.map, <div><em className={"fas fa-map-marked-alt fa-x2 navbar-icon"}></em> Mappa</div>)}
                        {
                            this.props.isLogged && this.props.user && this.props.user.organization ?
                                this.navBarLink(routes.myEvents, <div><em className={"fas fa-calendar-alt fa-x2 navbar-icon"}></em> Eventi Organizzati</div>) :
                                this.navBarLink(routes.myFriends, <div><em className={"fas fa-users fa-x2 navbar-icon"}></em> Amici</div>)
                        }
                        {this.navBarLink(routes.myNotifications, <div><em className={"fas fa-bell fa-x2 navbar-icon"}></em>{this.renderNotificationBadge()}</div>)}
                        {avatar}
                        <button id="btn-menu-desktop" name="btn-menu-desktop" className="btn btn-link dropdown-toggle dropdown-toggle-split text-dark" type="button" data-toggle="collapse"
                                data-target={"#" + this.menuContainerId} aria-expanded="false" aria-controls={this.menuContainerId}>
                        </button>
                    </div>
                </nav>
                <div className={filtersClass}
                     style={{marginTop: this.state.menuMarginTop, marginLeft: "74%"}}
                     id={this.menuContainerId}
                >
                    <div className={"menu-container col-12 bg-white"}>
                        <Menu {...this.props} hideNotifications={true} />
                    </div>
                </div>
            </div>
        )
    }
}

export {
    SearchBar,
    SimpleSearchBar,
    FriendsSearchBar,
    DesktopSearchBar,
    SEARCH_BY_EVENT,
    SEARCH_BY_PLACE,
    SEARCH_BAR,
    SIMPLE_SEARCH_BAR,
    FRIEND_SEARCH_BAR
}