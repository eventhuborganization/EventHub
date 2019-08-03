import React from 'react'
import {EventHeaderBanner, EventInteractionPanel, EventLocation, EventOrganizatorInfo} from "../event/Event"
import Contacts from '../contacts/Contacts'
import ApiService from '../../services/api/Api'
import GoogleApi from '../../services/google_cloud/GoogleMaps'

class EventInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventInfo: undefined
        }
        GoogleApi.getPlaceInformationByLocation({lat: 44, lng: 11}, () => {}, () => {})
        ApiService.getEventInformation(props.match.params.id,
            error => props.onError("Errore nel caricare le informazioni dell'evento. Ricaricare la pagina."),
                event => {
                    GoogleApi.getPlaceInformationByLocation(event.location,
                        () => props.onError("Errore nel caricare le informazioni riguardanti il luogo dell'evento. Ricaricare la pagina."),
                        result => this.setState(prevState => {
                            let state = prevState
                            state.eventInfo.location.place_id = result.place_id
                            return state
                        }))
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

    render() {
        if (this.state.eventInfo)
            return (
                <main className="main-container">

                    <section className="row">
                        <div className="col px-0 text-center">
                            <img src={ApiService.getImageUrl(this.state.eventInfo.thumbnail)}
                                 alt="Event thumbnail"
                                 className={"img-fluid " + (this.state.eventInfo.thumbnail ? "" : " d-none ")}
                            />
                        </div>
                    </section>

                    <section className={"sticky-top"}>
                        <EventHeaderBanner event={this.state.eventInfo} />
                    </section>

                    <section className={"mt-2"}>
                        <EventInteractionPanel {...this.props}
                                               key={this.state.eventInfo._id}
                                               event={this.state.eventInfo} />
                    </section>

                    <section className="row mt-2">
                        <div className="col">
                            <h5>Dettagli</h5>
                            <div className="container-fluid">
                                <EventOrganizatorInfo organizator={this.state.eventInfo.organizator}/>
                                <div className="row mt-2">
                                    <div className="col-12 px-0">
                                        <h6>Descrizione</h6>
                                        <p className="text-justify">{this.state.eventInfo.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {this.renderEventLocationMap()}

                    <Contacts event={this.state.eventInfo}/>

                </main>
            )
        else
            return (<div />)
    }
}

export default EventInfo