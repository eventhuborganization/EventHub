import React from 'react'
import {PARTY, SPORT, MEETING, EventHeaderBanner, EventLocation, EventOrganizatorInfo} from "../event/Event"
import Contacts from "../contacts/Contacts";
import {ConfirmButton} from "../floating_button/FloatingButton";
import ApiService from "../../services/api/Api";
import {RedirectComponent} from "../redirect/Redirect";
import {loadGoogleMapsScript} from "../../services/google_cloud/GoogleMaps";

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
                maxParticipants: undefined,
                organizator: props.loggedUser
            },
            eventCreated: false,
            eventId: undefined
        }
    }

    componentDidMount() {
        loadGoogleMapsScript(() => {
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
        })
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
        if(event.target.files.length > 0){
            reader.readAsDataURL(event.target.files[0])
        }
    }

    selectThumbnail = () => {
        document.getElementById("thumbnail").click()
    }

    updateDescription = event => {
        let state = this.state
        state.event.description = event.target.value
        this.setState(state)
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

    createEvent = () => {
        let event = this.state.event
        var errorFound = false
        let addErrorClassAndfocus = name => {
            let element = document.getElementById(name)
            element.classList.add("border")
            element.classList.add("border-danger")
            if (!errorFound) {
                errorFound = true
                element.focus()
                element.scrollIntoView()
            }
        }
        if (!event.thumbnailPreview)
            addErrorClassAndfocus("thumbnail-preview")
        if (!event.name)
            addErrorClassAndfocus("name")
        if (!event.typology)
            addErrorClassAndfocus("typology")
        if (!event.date)
            addErrorClassAndfocus("date")
        if (!event.time)
            addErrorClassAndfocus("time")
        if (!event.address || event.place)
            addErrorClassAndfocus("address")
        if (!event.maxParticipants)
            addErrorClassAndfocus("max-participants")
        if (!event.description)
            addErrorClassAndfocus("description")
        if (!errorFound) {
            ApiService.createNewEvent(this.state.event,
                    error => console.log(error),
                    response => {
                        let state = this.state
                        state.eventCreated = true
                        state.eventId = response.event._id
                        this.setState(state)
                    })
        }
    }

    renderRedirect() {
        if (this.state.eventCreated)
            return <RedirectComponent {...this.props}
                                      from={"/"}
                                      to={"/event/" + this.state.eventId}
                                      redirectNow={true}
            />
    }

    render() {
        return (
            <form className="main-container">
                {this.renderRedirect()}
                <section className="row">
                    <div id="thumbnail-preview" className="col px-0 text-center bg-light" onClick={this.selectThumbnail}>
                        <div className={"text-secondary " + (this.state.event.thumbnailPreview ? " d-none " : "" )}>
                            <em className="far fa-image fa-9x"></em>
                            <h4>Clicca per aggiungere un'immagine</h4>
                        </div>
                        <img src={this.state.event.thumbnailPreview}
                             alt="Event thumbnail"
                             className={"img-fluid " + (this.state.event.thumbnailPreview ? "" : " d-none ")}
                        />
                    </div>
                    <div className="d-none">
                        <label htmlFor="thumbnail" >Copertina dell'evento.</label>
                        <input
                            id="thumbnail"
                            name="thumbnail"
                            type="file"
                            accept="image/*"
                            className=""
                            onChange={this.updateThumbnailPreview}
                        />
                    </div>
                </section>

                <section className={"sticky-top"}>
                    <EventHeaderBanner event={this.state.event} />
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
                                        Incontro, size: ""
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
                                    placeholder="Indirizzo"
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
                            <EventOrganizatorInfo organizator={this.state.event.organizator}/>
                            <div className="row mt-2">
                                <div className="col-12 px-0">
                                    <h6>Descrizione</h6>
                                    <textarea id="description" className="w-75 text-justify" onChange={this.updateDescription} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className={"mt-2" + (this.state.event.place ? "" : " d-none ")}>
                    <EventLocation event={this.state.event} />
                </div>

                <Contacts event={this.state.event}/>

                <ConfirmButton onClick={this.createEvent} />

            </form>
        )
    }
}

export default EventCreator