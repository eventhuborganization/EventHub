import React from 'react'
import {Redirect} from 'react-router-dom'
import '../event_info/EventInfo.css'

import {
    PARTY,
    SPORT,
    MEETING,
    EventHeaderBanner,
    EventLocation,
    EventOrganizatorInfo
} from "../event/Event"
import Contacts from "../contacts/Contacts"
import {ConfirmButton} from "../floating_button/FloatingButton"
import ApiService from "../../services/api/Api"
import {LoginRedirect, RedirectComponent} from "../redirect/Redirect"
import GoogleApi from "../../services/google_cloud/GoogleMaps"
import {ImageForCard, LOCAL} from "../image/Image"
import AvatarHeader from "../avatar_header/AvatarHeader"
import ResizeService from "../../services/Resize/Resize"

let routes = require("../../services/routes/Routes")

class DeleteButton extends React.Component {

    constructor(props){
        super(props)
        this.state = {redirectHome: false}
    }

    onClick = () => {
        this.props.showMessage(
            {
                title: "Sei sicuro?",
                message: "Sei sicuro di voler eliminare l'evento? L'operazione è irreversibile",
                confirmMessage: "Elimina", 
                discardMessage: "Annulla"
            },
            () => {
                ApiService.deleteEvent(
                    this.props.event._id,
                    () => this.props.onError("Si è verificato un errore durante l'eliminazione, riprova."),
                    () => this.setState({redirectHome: true})
                )  
            },
            () => {})
    }

    redirectToHome = () => {
        return this.state.redirectHome ? 
            <Redirect from={this.props.from} to={routes.home} /> : <div/>
    }

    render () {
        return (
            <div>
                {this.redirectToHome()}
                <div role="button" className={"btn btn-danger btn-block button-size"} onClick={this.onClick}>
                    Elimina
                </div>
            </div>
        )
    }
}

class EventEditor extends React.Component {

    minDateTime = 1 *60 * 60 * 1000 // 1 hour
    timeMatchRegex = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$"

    constructor(props) {
        super(props)
        this.state = {
            onUpdate: props.onUpdate,
            dateSet: props.onUpdate,
            timeSet: props.onUpdate,
            eventCreated: false,
            eventUpdated: false,
            mode: this.displayWindowSize()
        }
        if(props.onUpdate && props.location && props.location.event 
            && props.location.event.organizator._id === props.loggedUser._id 
            ){
            this.state.oldEvent = {...props.location.event}
            this.state.oldEvent.date = new Date(this.state.oldEvent.date)
            this.state.oldEvent.location = {...props.location.event.location}
            this.state.event = props.location.event
            this.state.event.organizator = props.loggedUser
            this.state.event.thumbnailPreview = undefined
            this.state.eventId = props.location.event._id
        } else {
            this.state.event = {
                    name: "",
                    description: "",
                    date: undefined,
                    location: {
                        lat: undefined,
                        lng: undefined,
                        address: "",
                        place_id: undefined
                    },
                    public: true,
                    typology: undefined,
                    thumbnail: undefined,
                    thumbnailPreview: undefined,
                    maxParticipants: undefined,
                    organizator: props.loggedUser
            }
            this.state.eventId = undefined
            this.state.redirectHome = props.onUpdate
        }
    }

    displayWindowSize = () => {
        let width = window.innerWidth;
        let data = 0
        if(width < 768){
            data = 0
        } else if (width >= 768 && width < 992) {
            data = 1
        } else if (width >= 992 && width < 1200) {
            data = 2
        } else {
            data = 3
        }
        return data
    }

    componentDidMount() {
        this.props.setSearchBar(undefined, undefined, true)
        this.code = ResizeService.addSubscription(() => {
            let mode = this.displayWindowSize()
            this.setState({mode: mode})
        })
        if (this.props.isLogged)
            GoogleApi.loadGoogleMapsScript(() => {
                let inputAddress = document.getElementById('address')
                let searchBox = new window.google.maps.places.SearchBox(inputAddress)
                searchBox.addListener('places_changed', () => {
                    let places = searchBox.getPlaces()
                    if (places && places.length) {
                        let place = places[0]
                        if (place.address_components && place.address_components instanceof Array) {
                            let name = place.name
                            let isPoi = place.types && place.types.includes("point_of_interest")
                            let streetNumber = undefined
                            let streetAddress = undefined
                            let city = undefined
                            let political = undefined
                            place.address_components.forEach(component => {
                                if (!streetNumber && component.types.includes("street_number") && !isNaN(parseInt(component.short_name)))
                                    streetNumber = component.short_name
                                else if (!streetAddress && component.types.includes("route"))
                                    streetAddress = component.short_name
                                else if (!city && component.types.includes("locality"))
                                    city = component.short_name
                                else if (!political && component.types.includes("political"))
                                    political = component.short_name
                            })
                            let address_elems = []
                            if (isPoi && name)
                                address_elems.push(name)
                            if (streetAddress)
                                address_elems.push(streetAddress)
                            if (streetNumber)
                                address_elems.push(streetNumber)
                            if (city)
                                address_elems.push(city)
                            else if (political)
                                address_elems.push(political)
                            this.setState((prevState) => {
                                let state = prevState
                                state.event.location.address = address_elems.join(", ")
                                state.event.location.place_id = place.place_id
                                state.event.location.lat = place.geometry.location.lat()
                                state.event.location.lng = place.geometry.location.lng()
                                return state
                            })
                        } else {
                            this.props.onError("Devi selezionare uno degli indirizzi o luoghi proposti sotto la barra di ricerca.")
                        }
                    }
                })
            })
        if(this.state.onUpdate && !this.state.redirectHome){
            document.getElementById("name").value = this.state.event.name
            document.getElementById("address").value = this.state.event.location.address
            document.getElementById("max-participants").value = this.state.event.maxParticipants
            document.getElementById("description").value = this.state.event.description
            this.renderDate()
        }
    }

    componentWillUnmount() {
        this.props.setSearchBar(undefined, undefined, false)
        if (this.code >= 0)
            ResizeService.removeSubscription(this.code)
    }

    updateName = (event) => {
        event.persist()
        this.setState((prevState) => {
            let state = prevState
            state.event.name = event.target.value
            return state
        })
    }

    updateType = (event) => {
        event.persist()
        this.setState((prevState) => {
            let state = prevState
            state.event.typology = event.target.value
            return state
        })
    }

    updateMaxParticipants = (event) => {
        event.persist()
        if(event.target.value > 10000000) {
            this.props.onError("Numero massimo di partecipanti troppo elevato")
        } else {
            this.setState((prevState) => {
                let state = prevState
                state.event.maxParticipants = event.target.value
                return state
            })
        }
    }

    updateDate = (event) => {
        event.persist()
        this.setState((prevState) => {
            let state = prevState
            state.dateSet = true
            let date = event.target.valueAsDate
            if (state.event.date && date) {
                state.event.date.setFullYear(date.getFullYear())
                state.event.date.setMonth(date.getMonth())
                state.event.date.setDate(date.getDate())
            } else if (date) {
                state.event.date = date
            } else {
                state.dateSet = false
            }
            return state
        })
    }

    updateTime = (event) => {
        event.persist()
        this.setState(prevState => {
            let state = prevState
            state.timeSet = true
            let time = event.target.value
            if (time && time.match(this.timeMatchRegex)) {
                let timesInfo = time.split(":")
                if (!state.event.date) {
                    state.event.date = new Date()
                }
                state.event.date.setHours(timesInfo[0])
                state.event.date.setMinutes(timesInfo[1])
                state.event.date.setSeconds(0)
            } else {
                state.timeSet = false
            }
            return state
        })
    }

    updateThumbnailPreview = (event) => {
        event.persist()
        let reader = new FileReader()
        let image = event.target.files[0]
        reader.onload = e => {
            this.setState((prevState) => {
                let state = prevState
                state.event.thumbnail = image
                state.event.thumbnailPreview = e.target.result
                return state
            })
        }
        if(event.target.files.length > 0){
            reader.readAsDataURL(image)
        }
    }

    selectThumbnail = () => {
        document.getElementById("thumbnail").click()
    }

    updateDescription = event => {
        event.persist()
        this.setState((prevState) => {
            let state = prevState
            state.event.description = event.target.value
            return state
        })
    }

    updateVisibility = event => {
        event.persist()
        this.setState(prevState => {
            let state = prevState
            switch(event.target.value) {
                case "public":
                    state.event.public = true
                    break
                case "private":
                    state.event.public = false
                    break
                default:
                    break
            }
            return state
        })
    }

    checkErrors = () => {
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
        if (!event.thumbnail) {
            addErrorClassAndfocus("thumbnail-preview")
            this.props.onError("Non hai selezionato una immagine per l'evento!")
        }
        if (!event.name)
            addErrorClassAndfocus("name")
        if (!event.typology)
            addErrorClassAndfocus("typology")
        if (!this.state.dateSet)
            addErrorClassAndfocus("date")
        if (!this.state.timeSet)
            addErrorClassAndfocus("time")
        if (!event.location.lat || !event.location.lng)
            addErrorClassAndfocus("address")
        if (!event.maxParticipants)
            addErrorClassAndfocus("max-participants")
        if (!event.description)
            addErrorClassAndfocus("description")
        if (!errorFound && this.state.dateSet && this.state.timeSet && event.date && event.date - new Date() < this.minDateTime) {
            addErrorClassAndfocus("date")
            addErrorClassAndfocus("time")
            this.props.onError("La data e l'orario selezionati devono essere più avanti di un'ora rispetto ad adesso")
        }
        return errorFound
    }

    createEvent = () => {
        let errorFound = this.checkErrors()
        if (!errorFound) {
            ApiService.createNewEvent(this.state.event,
                    () => this.props.onError("Errore nella creazione dell'evento. Riprovare. Se l'errore persiste ricaricare la pagina."),
                    response => {
                        this.setState((prevState) => {
                            let state = prevState
                            state.eventCreated = true
                            state.eventId = response
                            return state
                        })
                    })
        }
    }

    updateEvent = () => {
        let errorFound = this.checkErrors()
        if (!errorFound) {
            let somethingIsChanged = false
            let newEvent = {}
            let event = this.state.event
            let oldEvent = this.state.oldEvent
            if(event.name !== oldEvent.name){
                newEvent.name = event.name
            }
            if(event.date.getTime() !== oldEvent.date.getTime()){
                newEvent.date = event.date
                somethingIsChanged = true
            }
            if(event.description !== oldEvent.description){
                newEvent.description = event.description
                somethingIsChanged = true
            }
            if(event.thumbnail !== oldEvent.thumbnail){
                newEvent.thumbnail = event.thumbnail
                somethingIsChanged = true
            }
            if(event.location !== oldEvent.location){
                newEvent.location = event.location
                somethingIsChanged = true
            }
            if(event.maxParticipants !== oldEvent.maxParticipants){
                if(event.maxParticipants > oldEvent.numParticipants){
                    newEvent.maxParticipants = event.maxParticipants
                    somethingIsChanged = true
                } else {
                    errorFound = true
                }
            }
            if(!errorFound && somethingIsChanged){
                ApiService.updateEventInfo(
                    this.state.oldEvent._id, 
                    newEvent,
                    () => this.props.onError("Errore nella modifica dell'evento. Riprovare. Se l'errore persiste ricaricare la pagina."),
                    () => this.setState({eventUpdated: true})
                )
            } else if(errorFound){
                this.props.onError("Hai inserito un numero di partecipanti massimi troppo basso, hai già più di " + event.maxParticipants + "utenti iscritti")
            } else {
                this.setState({eventUpdated: true})
            }
        }
    }

    renderRedirect() {
        if (this.state.eventUpdated)
            return <RedirectComponent {...this.props}
                                      from={routes.home}
                                      to={routes.eventFromId(this.state.eventId)}
                                      redirectNow={true}
            />
        else if (this.state.eventCreated)
            return <Redirect to={{pathname: routes.invite, event: this.state.event}} />
    }

    renderEventLocationMap = () => {
        if (this.state.event.location.place_id)
            return (
                <div className={"mt-2"}>
                    <EventLocation event={this.state.event} />
                </div>
            )
    }

    renderVisibility = () => {
        return  this.state.onUpdate || this.props.loggedUser.organization ? <div/> :
            <div className="row d-flex align-items-center">
                <div className="col-12">
                    <label className="m-0 event-info-section-title">Visibilità</label>
                    <div className="custom-control custom-radio">
                        <input
                            type="radio"
                            id="public"
                            name="visibility"
                            className="custom-control-input"
                            value="public"
                            onChange={this.updateVisibility}
                            defaultChecked={this.state.event.public}
                        />
                        <label className="m-0 custom-control-label event-info-text" htmlFor="public">Evento pubblico</label>
                    </div>
                    <div className="custom-control custom-radio">
                        <input
                            type="radio"
                            id="private"
                            name="visibility"
                            className="custom-control-input"
                            value="private"
                            onChange={this.updateVisibility}
                            defaultChecked={!this.state.event.public}
                        />
                        <label className="m-0 custom-control-label event-info-text" htmlFor="private">Evento privato</label>
                    </div>
                </div>
        </div>
    }

    renderDate = () => {
        var date = this.state.event.date
        if(!(date instanceof Date)){
            date = new Date(date)
        }
        var currentDate = date.toISOString().slice(0,10)
        var currentTime = date.getHours().toString().padStart(2,"0") + ':' + date.getMinutes().toString().padStart(2,"0")
        document.getElementById("date").value = currentDate
        document.getElementById("time").value = currentTime
    }

    redirectToHome = () => {
        return this.state.redirectHome ? 
            <Redirect from={this.props.from} to={routes.home} /> : <div/>
    }

    render() {
        let image = this.state.onUpdate && !this.state.event.thumbnailPreview ? 
            ApiService.getImageUrl(this.state.event.thumbnail) : this.state.event.thumbnailPreview
        return (
            <form className="row main-container">
                <div className={"col-12 col-xl-8 mx-auto"}>
                    {this.redirectToHome()}
                    <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                    {this.renderRedirect()}

                    <section className="row">
                        <div id="thumbnail-preview" className="col-12 col-md-6 col-xl-12 px-0 text-center" onClick={this.selectThumbnail}>
                            <ImageForCard imageName={image} type={LOCAL} text={"Clicca per aggiungere un'immagine"} size={(this.state.mode === 3 ? "event-info-image" : "")}  />
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
                        <div className={"col-md-6" + ((this.state.mode > 0 && this.state.mode < 3 ? "" : " d-none "))}>
                            <AvatarHeader elem={this.state.event.organizator} />
                            <Contacts event={this.state.event} hideTitle={true} />
                        </div>
                    </section>

                    <section className={(this.state.mode === 3 ? "" : " sticky-top ")}>
                        <EventHeaderBanner event={this.state.event} />
                    </section>

                    <section className={"row mt-2"}>
                        <div className="col container-fluid">
                            {this.renderVisibility()}
                            <div className="row d-flex align-items-center">
                                <div className={this.state.onUpdate ? "col-12" : "col-7 pr-2"}>
                                    <label htmlFor="name" className="m-0 event-info-section-title">Nome dell'evento</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control event-info-text"
                                        name="name"
                                        placeholder="Nome dell'evento"
                                        onChange={this.updateName}
                                        required
                                    />
                                </div>
                                {
                                    this.state.onUpdate ? <div/> :
                                        <div className="col-5 pl-2">
                                            <label className="m-0 event-info-section-title" htmlFor="typology">Typology</label>
                                            <select defaultValue={"placeholder"}
                                                    onChange={this.updateType}
                                                    className="form-control event-info-text"
                                                    id="typology">
                                                <option value="placeholder" disabled hidden>Type</option>
                                                <option value={PARTY}>Festa</option>
                                                <option value={MEETING}>Incontro</option>
                                                <option value={SPORT}>Sport</option>
                                            </select>
                                        </div>
                                }
                            </div>
                            <div className="row mt-2">
                                <div className="col-7 pr-2">
                                    <label htmlFor="date" className="m-0 event-info-section-title">Data</label>
                                    <input
                                        id="date"
                                        name="date"
                                        type="date"
                                        className="form-control event-info-text"
                                        onChange={this.updateDate}
                                        required
                                    />
                                </div>
                                <div className="col-5 pl-2">
                                    <label htmlFor="time" className="m-0 event-info-section-title">Orario</label>
                                    <input
                                        id="time"
                                        name="time"
                                        type="time"
                                        className="form-control event-info-text"
                                        onChange={this.updateTime}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row d-flex align-item-center mt-2">
                                <div className="col-12 col-xl-7 pr-xl-2">
                                    <label htmlFor="address" className="m-0 event-info-section-title">Luogo</label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        className="form-control event-info-text"
                                        placeholder="Indirizzo"
                                    />
                                </div>
                                <div className="col-5 pl-xl-2">
                                    <label htmlFor="max-participants" className="m-0 event-info-section-title">
                                        Partecipanti(max)
                                    </label>
                                    <input
                                        type="number"
                                        id="max-participants"
                                        className="form-control event-info-text"
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
                            <h5 className={"event-info-section-title font-weight-bold"}>Dettagli</h5>
                            <div className="container-fluid">

                                <section className={"row mt-2"  + (this.state.mode === 0 || this.state.mode === 3 ? "" : " d-none ")}>
                                    <div className="col-12 col-xl-6">
                                        <EventOrganizatorInfo organizator={this.state.event.organizator} level="h5"/>
                                    </div>
                                    <div className={"col-xl-6 mt-n2" + (this.state.mode === 3 ? "" : " d-none ")}>
                                        <Contacts event={this.state.event}/>
                                    </div>
                                </section>

                                <div className="row mt-2">
                                    <div className="col-12 px-0">
                                        <h6 className={"event-info-section-title"}>Descrizione</h6>
                                        <textarea id="description" className="w-100 form-control textarea-size event-info-text" onChange={this.updateDescription} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {this.renderEventLocationMap()}

                    <div className={(this.state.mode === 0 ? "" : " d-none ")}>
                        <Contacts event={this.state.event}/>
                    </div>

                    <div className={"d-xl-none"}>
                        <ConfirmButton onClick={this.state.onUpdate ? this.updateEvent : this.createEvent} />
                    </div>
                    <div className={"d-none d-xl-inline"}>
                        <div className={"row mt-4"}>
                            <div className={"col-6 mx-auto"}>
                                <button className={"btn btn-primary btn-block button-size"} type={"button"} onClick={this.state.onUpdate ? this.updateEvent : this.createEvent}>
                                    {this.state.onUpdate ? "Aggiorna Evento" : "Crea evento"}
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.onUpdate ?
                            <div className="row mt-4">
                                <div className="col-12 col-xl-6 mx-auto">
                                    <DeleteButton
                                        onError={this.props.onError}
                                        showMessage={this.props.showMessage}
                                        event={this.state.oldEvent}
                                    />
                                </div>
                            </div>
                            : <div/>
                    }
                </div>
            </form>
        )
    }
}

export default EventEditor