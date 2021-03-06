import React from 'react'
import EventCard from "../event_card/EventCard"
import { CreateNewEventButton } from "../floating_button/FloatingButton"
import { SimpleSearchBar, SIMPLE_SEARCH_BAR } from "../search_bar/SearchBar"
import ApiService from '../../services/api/Api'
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder"
import { LoginRedirect } from '../redirect/Redirect'
import LoadingSpinner from '../loading_spinner/LoadingSpinner'

export default class EventsByOrganizator extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            filter: "",
            displayEvents: true,
            eventsLoaded: [],
            searchBarData: {
                placeholder: "Cerca per nome",
                onChange: this.onFilterChange
            }
        }
        props.setSearchBar(SIMPLE_SEARCH_BAR, this.state.searchBarData)
        if((props.isLocalUser && props.isLogged) || !props.isLocalUser) {
            ApiService.getEventsByOrganizator(
                props.organizator._id,
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
        this.props.setSearchBar(SIMPLE_SEARCH_BAR, this.state.searchBarData)
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
            return (
                <div className={"row"}>
                    {
                        this.state.eventsLoaded
                            .filter(event => event.name.toLowerCase().includes(this.state.filter.toLowerCase()))
                            .map(event =>
                                <div className={"col-12 col-md-6 col-xl-3"} key={"event-card-container" + event._id}>
                                    <EventCard {...this.props}
                                               user={this.props.organizator}
                                               key={event._id}
                                               eventInfo={event}
                                    />
                                </div>
                            )
                    }
                </div>
            )
        } else if(this.state.displayEvents) {
            return <LoadingSpinner />  
        } else {
            let message = this.props.isLocalUser ?
                "Non hai creato nessun evento al momento"
                : "L'organizzatore non ha ancora creato un evento"
            return <NoItemsPlaceholder placeholder={message} />
        }
    }

    renderTitle = () => {
        return this.props.isLocalUser ?
                "I miei eventi"
                : "Gli eventi di " + this.props.organizator.name
    }

    onFilterChange = (event) => {
        this.setState({filter: event.target.value})
    }

    render() {
        return (
            <div className="main-container">

                <LoginRedirect {...this.props} redirectIfNotLogged={this.props.isLocalUser} />

                <section className="row sticky-top shadow bg-white border-bottom border-primary d-xl-none">

                    <div className="col-12">
                        <div 
                            data-toggle="collapse" 
                            data-target="#searchContent" 
                            aria-controls="searchContent" 
                            aria-expanded="false"
                            className="d-flex justify-content-start align-items-center" 
                            aria-label="Abilita ricerca eventi per nome">
                            <h2 className="py-2 m-0 page-title">{this.renderTitle()}</h2>
                            <div className={"ml-auto btn btn-primary button-size"}>
                                <em className="fas fa-search" aria-hidden="true"></em>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 collapse" id="searchContent">
                        <SimpleSearchBar
                            placeholder="Cerca per nome"
                            value={this.state.filter}
                            onChange={this.onFilterChange}
                        />
                    </div>
                </section>

                

                <CreateNewEventButton location={this.props.location} isLogged={this.props.isLogged} />

                <main className="main-container">
                    { this.renderEvents() }
                </main>
            </div>
        )
    }
}