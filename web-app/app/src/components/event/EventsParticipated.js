import React from 'react'
import { Redirect } from 'react-router-dom'

import EventCard from "../event_card/EventCard"
import ApiService from '../../services/api/Api'
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder"
import { LoginRedirect } from '../redirect/Redirect'
import LoadingSpinner from '../loading_spinner/LoadingSpinner'
import { EventsTab } from '../menu_tab/MenuTab'
import { EVENT_PARTICIPATED_SEARCH_BAR, EventParticipatedSearchBar } from '../search_bar/SearchBar'

let routes = require("../../services/routes/Routes")

export default class EventsPartecipated extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: "",
            date: undefined,
            displayEvents: true,
            eventsLoaded: [],
            searchBarData: {
                onNameChanged: this.onFilterChange,
                onDateChanged: this.updateDate,
                onResetValues: this.resetValues
            }
        }
        this.props.setSearchBar(EVENT_PARTICIPATED_SEARCH_BAR, this.state.searchBarData)
        if((props.isLocalUser && props.isLogged) || !props.isLocalUser) {
            ApiService.getSubscribedEvents(
                error => this.onSearchError(error),
                response => {
                    if (response.length <= 0)
                        this.setState({displayEvents: false})
                    else
                        this.setState({eventsLoaded: response})
                })
        }
    }

    componentDidMount() {
        this.props.setSearchBar(EVENT_PARTICIPATED_SEARCH_BAR, this.state.searchBarData)
    }

    componentWillUnmount() {
        this.props.unsetSearchBar()
    }

    onSearchError = error => {
        this.setState(
            { displayEvents: false },
            () => {
                if (error.response && error.response.status !== 404) {
                    this.props.onError("Errore nel prendere i dati, ricarica.")
                }
            })
    }

    renderEvents = () => {
        if (this.state.displayEvents && this.state.eventsLoaded.length > 0) {
            let tabs = [
                this.createSingleTab("Pubblici",this.displayEvents(this.state.eventsLoaded, true)),
                this.createSingleTab("Privati", this.displayEvents(this.state.eventsLoaded, false))
            ]
            return <EventsTab tabs={tabs} />
        } else if(this.state.displayEvents) {
            return <LoadingSpinner />
        } else {
            return <NoItemsPlaceholder placeholder={"Non hai partecipato a nessun evento al momento"} />
        }
    }

    filterEvents = (event, hasToBePublic) => {
        return event.name.toLowerCase().includes(this.state.name.toLowerCase())
            && event.public === hasToBePublic
            && (!this.state.date || new Date(event.date) > this.state.date)
    }

    displayEvents = (events, hasToBePublic) => {
        return (
            <div className={"row"}>
                {
                    events
                        .filter(event => this.filterEvents(event, hasToBePublic))
                        .map(event =>
                            <div className={"col-12 col-md-6 col-xl-3"} key={"event-card-container" + event._id}>
                                <EventCard {...this.props}
                                           key={event._id}
                                           eventInfo={event}
                                />
                            </div>
                        )
                }
            </div>
        )
    }

    updateDate = (event) => {
        let date = new Date(event.target.value)
        if(date.getFullYear() / 1000 > 1){
            this.setState({date: date})
        } else if(!event.target.value){
            this.setState({date: undefined})
        }
    }

    onFilterChange = (event) => {
        this.setState({name: event.target.value})
    }

    resetValues = () => {
        this.setState({name: "", date: undefined})
    }

    createSingleTab = (tag, elem) => {
        return Object.freeze({ tag: tag, elem: elem})
    }

    redirectHome = () => {
        return this.props.user.organization ? <Redirect to={routes.home} /> : <div/>
    }

    render() {
        return (
            <div className="main-container">

                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                {this.redirectHome()}

                <EventParticipatedSearchBar
                    value={this.state.name}
                    onNameChanged={this.onFilterChange}
                    onDateChanged={this.updateDate}
                    onResetValues={this.resetValues}
                />

                <main className="main-container">
                    { this.renderEvents() }
                </main>
            </div>
        )
    }
}