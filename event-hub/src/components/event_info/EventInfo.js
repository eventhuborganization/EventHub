import React from 'react';
import {EventHeaderBanner, EventLocation, EventOrganizatorInfo} from "../event/Event";
import Contacts from '../contacts/Contacts'
import ApiService from '../../services/api/Api'

class EventInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventInfo: undefined
        }
        ApiService.getEventInformation(props.match.params.id,
            error => props.onError("Errore nel caricare le informazioni dell'evento. Ricaricare la pagina."),
                response => {
                    this.setState((prevState, props) => {
                        let state = this.state
                        state.eventInfo = {
                            name: response.data.name,
                            thumbnail: response.data.thumbnail,
                            date: response.data.date.toString(),
                            address: response.data.location,
                            numParticipants: response.data.numParticipants,
                            maxParticipants: response.data.maxParticipants,
                            description: response.data.description,
                            organizator: {
                                phoneNumber: response.data.organizator.phone,
                                email: response.data.organizator.email,
                            },
                            typology: response.data.typology
                        }
                        return state
                    })
                })
    }

    render() {
        if (this.state.eventInfo)
            return (
                <main className="main-container">

                    <section className="row">
                        <div className="col px-0 text-center bg-dark">
                            <img src={ApiService.getImageUrl(this.state.eventInfo.thumbnail)}
                                 alt="Event thumbnail"
                                 className="img-fluid" />
                        </div>
                    </section>
                    <section className={"sticky-top"}>
                        <EventHeaderBanner event={this.state.eventInfo} />
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

                    <EventLocation event={this.state.eventInfo} />

                    <Contacts event={this.state.eventInfo}/>

                </main>
            )
        else
            return (<div />)
    }
}

export default EventInfo