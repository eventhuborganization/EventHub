import React from 'react'
import Styles from '../event_info/EventInfo.module.css'
import {EventBadge, PARTY, SPORT, MEETING} from "../event/Event"
import {GoogleMaps} from '../../services/google_cloud/GoogleMaps'
import GoogleMapsProperties from "../../services/google_cloud/Properties"

let images = require.context("../../assets/images", true)

class EventCreator extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            event: {
                name: "",
                description: "",
                date: undefined,
                time: undefined,
                address: "",
                place: undefined,
                public: true,
                typology: undefined,
                thumbnail: undefined,
                thumbnailPreview: undefined,
                maxParticipants: undefined
            },
            mapsApi: new GoogleMaps()
        }
    }

    componentDidMount() {
        let googleMapScript = document.createElement('script')
        googleMapScript.src = "https://maps.googleapis.com/maps/api/js?key=" + GoogleMapsProperties.key + "&libraries=places"
        window.document.body.appendChild(googleMapScript)
        googleMapScript.onload = () => {
            let inputAddress = document.getElementById('address')
            let searchBox = new window.google.maps.places.SearchBox(inputAddress)
            searchBox.addListener('places_changed', () => {
                let places = searchBox.getPlaces()
                if (places && places.length) {
                    let place = places[0]
                    let streetNumber = place.address_components[0].short_name
                    let streetAddress = place.address_components[1].short_name
                    let city = place.address_components[2].short_name
                    let address = streetAddress + ", " + streetNumber + ", " + city
                    let state = this.state
                    state.event.address = address
                    state.event.place = place
                    this.setState(state)
                }
            })
        }
    }

    canCreate() {
        let state = this.state
        return state.event.name
            && state.event.description
            && state.event.address
            && state.event.location
            && state.event.typology
            && state.event.maxParticipants
            && state.event.thumbnail
            && state.event.date
            && state.event.time
    }

    renderBadge() {
        if (this.state.event.typology)
            return <EventBadge event={this.state.event} />
    }

    updateName = (event) => {
        let state = this.state
        state.event.name = event.target.value
        this.setState(state)
    }

    updateType = (event) => {
        let state = this.state
        state.event.typology = event.target.value
        this.setState(state)
    }

    updateMaxParticipants = (event) => {
        let state = this.state
        state.event.maxParticipants = event.target.value
        this.setState(state)
    }

    updateDate = (event) => {
        let state = this.state
        state.event.date = event.target.value
        this.setState(state)
    }

    updateTime = (event) => {
        let state = this.state
        state.event.time = event.target.value
        this.setState(state)
    }

    updateThumbnailPreview = (event) => {
        let reader = new FileReader()
        reader.onload = e => {
            let state = this.state
            state.event.thumbnailPreview = e.target.result
            this.setState(state)
        }
        reader.readAsDataURL(event.target.files[0])
    }

    selectThumbnail = () => {
        document.getElementById("thumbnail").click()
    }

    updateDescription = event => {
        let state = this.state
        state.event.description = event.target.value
        this.setState(state)
    }

    createEvent = (event) => {
        if (this.canCreate()) {
            //create event
        } else {
            //show errors
        }
    }

    getBannerClass = () => {
        let type = this.state.event.typology
        if (type === PARTY)
            return Styles.partyBanner
        else if (type === MEETING)
            return Styles.meetingBanner
        else if (type === SPORT)
            return Styles.sportBanner
        else
            return "bg-white"
    }



    render() {
        var mapSrc = ""
        if (this.state.event.place)
            mapSrc = "https://www.google.com/maps/embed/v1/place?q=place_id:" + (this.state.event.place ? this.state.event.place.place_id : "") + "&zoom=18&key=AIzaSyBgO5HuSUcxIIEqj4tN4edLO-89sr6dOOs"
        return (
            <form onSubmit={this.createEvent} className="main-container">

                <section className="row">
                    <div className="col px-0 text-center bg-light" onClick={this.selectThumbnail}>
                        <div className={"text-secondary " + (this.state.event.thumbnailPreview ? " d-none " : "" )}>
                            <em className="far fa-image fa-9x"></em>
                            <h4>Clicca per aggiungere un'immagine</h4>
                        </div>
                        <img src={this.state.event.thumbnailPreview}
                             alt="Event thumbnail"
                             className={"img-fluid " + (this.state.event.thumbnailPreview ? "" : "d-none")}
                        />
                    </div>
                    <div className="d-none">
                        <label htmlFor="thumbnail" >Copertina dell'evento.</label>
                        <input
                            id="thumbnail"
                            name="thumbnail"
                            type="file"
                            className=""
                            onChange={this.updateThumbnailPreview}
                        />
                    </div>
                </section>

                <section className={"row sticky-top pt-2 " + this.getBannerClass()}>
                    <div className="col container-fluid">
                        <div className="row d-flex align-items-center">
                            <div className="col-8 mb-1">
                                <h4 className={"m-0 " + (this.state.event.name ? "" : " d-none ")}>
                                    {this.state.event.name}
                                </h4>
                            </div>
                            <div className="col-4 d-flex justify-content-end">
                                {this.renderBadge()}
                            </div>
                        </div>
                        <div className="row d-flex align-items-center">
                            <div className="col-8 mb-1">
                                <h6 className={"m-0 " + (this.state.event.date || this.state.event.time ? "" : " d-none ")}>
                                    {this.state.event.date} - {this.state.event.time}
                                </h6>
                                <h6 className={"m-0 " + (this.state.event.address ? "" : " d-none ")}>
                                    {this.state.event.address}
                                </h6>
                            </div>
                            <div className="col-4 d-flex justify-content-end">
                                <p className={"m-0 " + (this.state.event.maxParticipants ? "" : " d-none ")}>0/{this.state.event.maxParticipants}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={"row mt-2"}>
                    <div className="col container-fluid">
                        <div className="row d-flex align-items-center">
                            <div className="col-7 pr-2">
                                <label htmlFor="name" className="m-0">Nome dell'evento</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                    name="name"
                                    placeholder="Nome dell'evento"
                                    onChange={this.updateName}
                                    required
                                />
                            </div>
                            <div className="col-5 pl-2">
                                <label className="m-0" htmlFor="typology">Typology</label>
                                <select defaultValue={"placeholder"}
                                        onChange={this.updateType}
                                        className="form-control"
                                        id="typology">
                                    <option value="placeholder" disabled hidden>Type</option>
                                    <option value={PARTY}>
                                        Festa
                                    </option>
                                    <option value={MEETING}>
                                        Incontro
                                    </option>
                                    <option value={SPORT}>
                                        Sport
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-7 pr-2">
                                <label htmlFor="date" className="m-0">Data</label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    className="form-control"
                                    onChange={this.updateDate}
                                />
                            </div>
                            <div className="col-5 pl-2">
                                <label htmlFor="time" className="m-0">Orario</label>
                                <input
                                    id="time"
                                    name="time"
                                    type="time"
                                    className="form-control"
                                    onChange={this.updateTime}
                                />
                            </div>
                        </div>
                        <div className="row d-flex align-item-center mt-2">
                            <div className="col-7 pr-2">
                                <label htmlFor="address" className="m-0">Dove</label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    className="form-control"

                                />
                            </div>
                            <div className="col-5 pl-2">
                                <label htmlFor="max-participants" className="m-0">
                                    Partecipanti(max)
                                </label>
                                <input
                                    type="number"
                                    id="max-participants"
                                    className="form-control"
                                    name="max-participants"
                                    onChange={this.updateMaxParticipants}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="row mt-2">
                    <div className="col-12">
                        <h5>Dettagli</h5>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12 px-0">
                                    <h6>Organizzatore</h6>
                                </div>
                                <div className="col-2 p-0">
                                    <img src={(this.props.loggedUser.avatar ? images(`./${this.props.loggedUser.avatar}`) : '')}
                                         className="img-fluid border rounded-circle"
                                         alt="Immagine profilo utente"
                                    />
                                </div>
                                <div className="col-10 d-flex justify-content-start align-items-center">
                                    <span className="text-invited font-weight-bold">{this.props.loggedUser.name} {this.props.loggedUser.surname}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 px-0">
                                    <h6>Descrizione</h6>
                                    <textarea className="w-75 text-justify" onChange={this.updateDescription} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="row mt-2">
                    <div className="col-12">
                        <h5>Luogo dell'evento</h5>
                        <div className={"embed-responsive embed-responsive-16by9 " + (this.state.event.place ? "" : " d-none ")}>
                            <div className={"embed-responsive-item"}>
                                <iframe title={"event-location"}
                                        width="100%" height="100%" style={{border: 0}}
                                        src={mapSrc}
                                        allowFullScreen
                                />
                            </div>
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
                            <p className="col my-0 d-flex align-items-center">{this.props.loggedUser.phoneNumber}</p>
                        </div>
                        <div className="row">
                            <div className="col-2 d-flex align-items-center justify-content-center">
                                <em className="fas fa-envelope fa-2x rounded text-secondary"></em>
                            </div>
                            <p className="col my-0 d-flex align-items-center">{this.props.loggedUser.email}</p>
                        </div>
                        <div className="row">
                            <div className="col-2 d-flex align-items-center justify-content-center">
                                <em className="fas fa-comments fa-2x rounded text-secondary"></em>
                            </div>
                            <p className="col my-0 d-flex align-items-center">Facci una domanda!</p>
                        </div>
                    </div>
                </section>

            </form>
        )
    }
}

export default EventCreator