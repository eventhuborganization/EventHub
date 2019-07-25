import React from 'react';
import {EventHeaderBanner, EventLocation, EventOrganizatorInfo, FollowButton, ParticipateButton} from "../event/Event";
import Contacts from '../contacts/Contacts'
import ApiService from '../../services/api/Api'

let images = require.context("../../assets/images", true)

class EventInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventInfo: {
                name: "Evento della madonna",
                thumbnail: "concerto.jpeg",
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
                    avatar: "user-profile-image.jpg",
                    name: "Francesco",
                    surname: "Grandinetti"
                },
                typology: "sport"
            }
        }
        ApiService.getEventInformation(props.match.params.id, props.onError,
                response => {
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
                })
    }

    render() {
        return (
            <main className="main-container">

                <section className="row">
                    <div className="col px-0 text-center bg-dark">
                        <img src={(this.state.eventInfo.thumbnail ? images(`./${this.state.eventInfo.thumbnail}`) : '')}
                             alt="Event thumbnail"
                             className="img-fluid" />
                    </div>
                </section>
                <section className={"sticky-top"}>
                    <EventHeaderBanner event={this.state.eventInfo} />
                </section>
                <section className="row mt-2">
                    <div className="col-12 d-flex justify-content-end">
                        <FollowButton {...this.props} event={this.state.eventInfo}/>
                        <ParticipateButton {...this.props} event={this.state.eventInfo}/>
                    </div>
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
    }
}

export default EventInfo