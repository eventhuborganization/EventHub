import React from 'react';
import Styles from './EventInfo.module.css';
import Axios from 'axios';

class EventInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventInfo: {
                name: "Evento della madonna",
                thumbnail: "",
                date: "26 Luglio 2019 - 21:00",
                address: "Via tal dei tali, 33",
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

                <section className={"row sticky-top " + Styles[type + "Banner"] + " pt-2"}>
                    <div className="col container-fluid">
                        <div className="row d-flex align-items-center">
                            <div className="col-9 mb-1">
                                <h4 className="m-0">{this.state.eventInfo.name}</h4>
                            </div>
                            <div className="col-3 d-flex justify-content-center">
                                <div className={"badge badge-pill " + type + " " + type + "Badge"}>#{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                            </div>
                        </div>
                        <div className="row d-flex align-items-center">
                            <div className="col-9 mb-1">
                                <h6 className="m-0">{this.state.eventInfo.date}</h6>
                                <h6 className="m-0">{this.state.eventInfo.address}</h6>
                            </div>
                            <div className="col-3 d-flex justify-content-end">
                                <p className="m-0">{this.state.eventInfo.numParticipants}/{this.state.eventInfo.maxParticipants}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="row mt-2">
                    <div className="col-12 d-flex justify-content-end">
                        <button className={"btn " + type + "Button " + type + "ButtonSecondary " + Styles.buttonEvent}>Segui</button>
                        <button className={"btn " + type + "Button " + type + "ButtonPrimary ml-2 " + Styles.buttonEvent}>Partecipa</button>
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

                <section className="row mt-2">
                    <div className="col col-md-6">
                        <h5>Luogo dell'evento</h5>
                        <div className="embed-responsive embed-responsive-16by9">
                            <iframe
                                title={this.props.match.params.id + " loaction"}
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2862.8552303608158!2d12.235158712371355!3d44.14822954462452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132ca55098146cbf%3A0x6de70b93cd4aed53!2sUniversit%C3%A0+di+Bologna+-+Campus+di+Cesena!5e0!3m2!1sit!2sit!4v1561908171773!5m2!1sit!2sit"
                                className="embed-responsive-item"
                                style={{border: 0}} allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                </section>

                <section className="row mt-2">
                    <div className={"col d-flex flex-column " + Styles.buttonEvent}>
                        <h5>Contatti</h5>
                        <div className="row">
                            <div className="col-2 d-flex align-items-center justify-content-center">
                                <em className="fas fa-phone fa-2x text-secondary"></em>
                            </div>
                            <p className="col my-0 d-flex align-items-center">{this.state.eventInfo.organizator.phoneNumber}</p>
                        </div>
                        <div className="row">
                            <div className="col-2 d-flex align-items-center justify-content-center">
                                <em className="fas fa-envelope fa-2x rounded text-secondary"></em>
                            </div>
                            <p className="col my-0 d-flex align-items-center">{this.state.eventInfo.organizator.email}</p>
                        </div>
                        <div className="row">
                            <div className="col-2 d-flex align-items-center justify-content-center">
                                <em className="fas fa-comments fa-2x rounded text-secondary"></em>
                            </div>
                            <p className="col my-0 d-flex align-items-center">Facci una domanda!</p>
                        </div>
                    </div>
                </section>

            </main>
        )
    }
}

export default EventInfo