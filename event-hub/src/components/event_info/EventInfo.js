import React from 'react';
import Axios from 'axios';
import {EventHeaderBanner, EventLocation, FollowButton, ParticipateButton} from "../event/Event";
import Contacts from '../contacts/Contacts'

class EventInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventInfo: {
                name: "Evento della madonna",
                thumbnail: "",
                date: "26 Luglio 2019",
                time: "21:00",
                address: "Via tal dei tali, 33",
                place: { place_id: "ChIJtYuu0V25j4ARwu5e4wwRYgE"},
                numParticipants: 37,
                maxParticipants: 100,
                description: "Una madonna madonnesca",
                organizator: {
                    phoneNumber: "+39 3334442222",
                    email: "pippo@gmail.com",
                },
                typology: "sport"
            }
        }
        Axios.get(this.props.mainServer + "/events/info/" + this.props.match.params.id)
            .then(response => {
                let status = response.status
                if (status !== 200)
                    this.props.onError("Errore durante il caricamento dei dati di un evento.")
                else
                    this.setState({
                        eventInfo: {
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
                    })
            })
    }

    render() {
        let type = this.state.eventInfo.typology
        return (
            <main className="main-container">

                <section className="row">
                    <div className="col px-0 text-center bg-dark">
                        <img src={this.props.mainServer + this.state.eventInfo.thumbnail} alt="" className="img-fluid" />
                    </div>
                </section>
                <EventHeaderBanner event={this.state.eventInfo} />
                <section className="row mt-2">
                    <div className="col-12 d-flex justify-content-end">
                        <FollowButton {...this.props} event={this.state.eventInfo}/>
                        <ParticipateButton {...this.props} event={this.state.eventInfo}/>
                    </div>
                </section>

                <section className="row mt-2">
                    <div className="col">
                        <h5>Dettagli</h5>
                        <p className="text-justify">
                            {this.state.eventInfo.description}
                        </p>
                    </div>
                </section>

                <EventLocation event={this.state.eventInfo} />

                <Contacts event={this.state.eventInfo}/>

            </main>
        )
    }
}

export default EventInfo