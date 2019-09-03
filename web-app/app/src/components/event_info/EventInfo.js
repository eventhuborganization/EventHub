import React from 'react'
import {Redirect} from 'react-router-dom'
import ShowMore from 'react-show-more'
import {EventHeaderBanner, EventInteractionPanel, EventLocation, EventOrganizatorInfo} from "../event/Event"
import Contacts from '../contacts/Contacts'
import ApiService from '../../services/api/Api'
import GoogleApi from '../../services/google_cloud/GoogleMaps'
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder"
import {Link} from "react-router-dom"
import {IMAGE, ImageForCard} from "../image/Image"
import {MultipleUsersBanner} from "../multiple_elements_banner/MultipleElementsBanner"

let routes = require("../../services/routes/Routes")

class EventInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventInfo: undefined,
            redirectHome: false
        }
        ApiService.getEventInformation(props.match.params.id,
            () => props.onError("Errore nel caricare le informazioni dell'evento. Ricaricare la pagina."),
                event => {
                    GoogleApi.getPlaceInformationByLocation(event.location,
                        () => props.onError("Errore nel caricare le informazioni riguardanti il luogo dell'evento. Ricaricare la pagina."),
                        result => this.setState(prevState => {
                            let state = prevState
                            state.eventInfo.location.place_id = result.place_id
                            return state
                        }))
                    event.participantsFilled = event.participants.map(id => {return {_id: id}})
                    this.setState({eventInfo: event})
                })
    }

    renderEventLocationMap = () => {
        if (this.state.eventInfo.location.place_id)
            return (
                <div className={"mt-2"}>
                    <EventLocation event={this.state.eventInfo} />
                </div>
            )
    }

    redirectToHome = () => {
        return this.state.redirectHome ? 
            <Redirect from={this.props.from} to={routes.home} /> : <div/>
    }

    render() {
        if (this.state.eventInfo)
            return (
                <main className="main-container">
                    {this.redirectToHome()}
                    <section className="row">
                        <div className="col px-0 text-center">
                            <ImageForCard imageName={this.state.eventInfo.thumbnail} type={IMAGE} />
                        </div>
                    </section>

                    <section className={"sticky-top"}>
                        <EventHeaderBanner event={this.state.eventInfo} />
                    </section>

                    <section className={"mt-2"}>
                        <EventInteractionPanel {...this.props}
                                               key={this.state.eventInfo._id}
                                               event={this.state.eventInfo}
                                               hideBadge={true}
                                               onEventParticipated={event =>  this.setState(prevState => {
                                                   let state = prevState
                                                   state.eventInfo.participants = event.participants
                                                   state.eventInfo.numParticipants = event.participants.length
                                                   return state
                                               })}
                                               onEventFollowed={event =>  this.setState(prevState => {
                                                   let state = prevState
                                                   state.eventInfo.followers = event.followers
                                                   return state
                                               })}
                                               onEventDeleted = {() => this.setState({redirectHome: true})}
                                               showReviewModal={this.props.showReviewModal}
                        />
                    </section>

                    <section className="row mt-2">
                        <div className="col-12">
                            <div className="container-fluid">
                                <EventOrganizatorInfo organizator={this.state.eventInfo.organizator} level="h5"/>
                            </div>
                        </div>
                    </section>

                    <MultipleUsersBanner
                        users={this.state.eventInfo.participantsFilled}
                        emptyLabel={"Nessun partecipante al momento"}
                        typology={"Partecipanti"}
                        moreUsersLink={"ciao"}
                        noPadding={false}
                        margin={"mt-2"}
                        level={"h5"}
                        usersInfoIncomplete={true}
                    />

                    <section className="row mt-2">
                        <div className="col-12">
                            <h5>Descrizione</h5>
                            <ShowMore
                                lines={5}
                                more='Altro'
                                less='Mostra meno'
                            >
                                {this.state.eventInfo.description}
                            </ShowMore>
                        </div>
                    </section>

                    {this.renderEventLocationMap()}

                    <Contacts event={this.state.eventInfo}/>

                </main>
            )
        else
            return (
                <div>
                    <NoItemsPlaceholder placeholder={"Le informazioni per questo evento non sono al momento disponibili"} />
                    <div className={"row"}>
                        <div className={"col-12"}>
                            <div className={"text-right h4 mt-2"}>
                                <Link to={routes.home}>Ritorna alla home</Link>
                            </div>
                        </div>
                    </div>
                </div>
                )
    }
}

export default EventInfo