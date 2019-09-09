import React from 'react'
import { Redirect } from 'react-router-dom'

import EventCard from "../event_card/EventCard"
import ApiService from '../../services/api/Api'
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder"
import { LoginRedirect } from '../redirect/Redirect'
import LoadingSpinner from '../loading_spinner/LoadingSpinner'
import { EventsTab } from '../menu_tab/MenuTab'

let routes = require("../../services/routes/Routes")

export default class EventsPartecipated extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: "",
            date: undefined,
            displayEvents: true,
            eventsLoaded: []
        }
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

                <section className="row sticky-top shadow bg-white border-bottom border-primary">

                    <div className="col-12">
                        <div 
                            data-toggle="collapse" 
                            data-target="#searchContent" 
                            aria-controls="searchContent" 
                            aria-expanded="false"
                            className="d-flex justify-content-start align-items-center" 
                            aria-label="Abilita ricerca eventi per nome">
                            <h2 className="py-2 m-0 page-title">Eventi di interesse</h2>
                            <div className={"ml-auto btn btn-primary button-size"}>
                                <em className="fas fa-search" aria-hidden="true"></em>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 collapse" id="searchContent">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name" className="m-0 form-title">Nome</label>
                                <input
                                    id="name"
                                    name={"name"}
                                    type="text"
                                    className="form-control form-size"
                                    value={this.state.name}
                                    onChange={this.onFilterChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date" className="m-0 form-title">A partire dal</label>
                                <input
                                    id={"date"}
                                    name={"date"}
                                    type="date"
                                    className="form-control form-size"
                                    onChange={this.updateDate}
                                />
                            </div>
                            <div className={"d-flex justify-content-end align-items-end form-group"}>
                                <input type="reset" value="Cancella" className={"btn btn-danger button-size"} onClick={this.resetValues}/>
                            </div>
                        </form>
                    </div>
                </section>

                <main className="main-container">
                    { this.renderEvents() }
                </main>
            </div>
        )
    }
}