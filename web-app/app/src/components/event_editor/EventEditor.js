import React from 'react'
import {Redirect} from 'react-router-dom'
import {PARTY, SPORT, MEETING, EventHeaderBanner, EventLocation, EventOrganizatorInfo} from "../event/Event"
import Contacts from "../contacts/Contacts"
import {ConfirmButton} from "../floating_button/FloatingButton"
import ApiService from "../../services/api/Api"
import {LoginRedirect, RedirectComponent} from "../redirect/Redirect"
import GoogleApi from "../../services/google_cloud/GoogleMaps"

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
            <Redirect from={this.props.from} to={"/"} /> : <div/>
    }

    render () {
        return (
            <div>
                {this.redirectToHome()}
                <div role="button" className={"btn btn-danger btn-block"} onClick={this.onClick}>
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
        }
        if(props.onUpdate && props.location && props.location.state 
                && props.location.state.event && props.location.state.event.organizator._id === props.loggedUser._id 
            ){
            this.state.oldEvent = {...props.location.state.event}
            this.state.oldEvent.date = new Date(this.state.oldEvent.date)
            this.state.oldEvent.location = {...props.location.state.event.location}
            this.state.event = props.location.state.event
            this.state.event.thumbnailPreview = undefined
            this.state.eventId = props.location.state.event._id
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

    componentDidMount() {
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
                            let isPoi = place.types.includes("point_of_interest")
                            let streetNumber = undefined
                            let streetAddress = undefined
                            let city = undefined
                            let political = undefined
                            place.address_components.forEach(component => {
                                if (!streetNumber && component.types.includes("street_number"))
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
                    () => this.setState({eventCreated: true})
                )
            } else if(errorFound){
                this.props.onError("Hai inserito un numero di partecipanti massimi troppo basso, hai già più di " + event.maxParticipants + "utenti iscritti")
            } else {
                this.setState({eventCreated: true})
            }
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

    renderEventLocationMap = () => {
        if (this.state.event.location.place_id)
            return (
                <div className={"mt-2"}>
                    <EventLocation event={this.state.event} />
                </div>
            )
    }

    renderVisibility = () => {
        return  this.state.onUpdate ? <div/> :
            <div className="row d-flex align-items-center">
                <div className="col-12">
                    <label className="m-0">Visibilità</label>
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
                        <label className="m-0 custom-control-label" htmlFor="public">Evento pubblico</label>
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
                        <label className="m-0 custom-control-label" htmlFor="private">Evento privato</label>
                    </div>
                </div>
        </div>
    }

    renderDate = () => {
        var date = this.state.event.date
        var currentDate = date.toISOString().slice(0,10)
        var currentTime = date.getHours().toString().padStart(2,"0") + ':' + date.getMinutes().toString().padStart(2,"0")
        document.getElementById("date").value = currentDate
        document.getElementById("time").value = currentTime
    }

    redirectToHome = () => {
        return this.state.redirectHome ? 
            <Redirect from={this.props.from} to={"/"} /> : <div/>
    }

    render() {
        let image = this.state.onUpdate && !this.state.event.thumbnailPreview ? 
            ApiService.getImageUrl(this.state.event.thumbnail) : this.state.event.thumbnailPreview
        return (
            <form className="main-container">
                {this.redirectToHome()}
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                {this.renderRedirect()}
                <section className="row">
                    <div id="thumbnail-preview" className="col px-0 text-center bg-light" onClick={this.selectThumbnail}>
                        <div className={"text-secondary " + (this.state.event.thumbnail ? " d-none " : "" )}>
                            <em className="far fa-image fa-9x"></em>
                            <h4>Clicca per aggiungere un'immagine</h4>
                        </div>
                        <img src={image}
                             alt="Event thumbnail"
                             className={"img-fluid w-100 " + (this.state.event.thumbnail ? "" : " d-none ")}
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
                        {this.renderVisibility()}
                        <div className="row d-flex align-items-center">
                            <div className={this.state.onUpdate ? "col-12" : "col-7 pr-2"}>
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
                            {
                                this.state.onUpdate ? <div/> : 
                                    <div className="col-5 pl-2">
                                        <label className="m-0" htmlFor="typology">Typology</label>
                                        <select defaultValue={"placeholder"}
                                                onChange={this.updateType}
                                                className="form-control"
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
                                <label htmlFor="date" className="m-0">Data</label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    className="form-control"
                                    onChange={this.updateDate}
                                    required
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
                                    required
                                />
                            </div>
                        </div>
                        <div className="row d-flex align-item-center mt-2">
                            <div className="col-12">
                                <label htmlFor="address" className="m-0">Luogo</label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    className="form-control"
                                    placeholder="Indirizzo"
                                />
                            </div>
                        </div>
                        <div className="row d-flex align-item-center mt-2">
                            <div className="col-5">
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
                            <EventOrganizatorInfo organizator={this.state.event.organizator} level="h6"/>
                            <div className="row mt-2">
                                <div className="col-12 px-0">
                                    <h6>Descrizione</h6>
                                    <textarea id="description" className="w-100 form-control" onChange={this.updateDescription} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {this.renderEventLocationMap()}

                <Contacts event={this.state.event}/>

                {
                    this.state.onUpdate ? 
                        <div className="row mt-4">
                            <div className="col">
                                <DeleteButton
                                    onError={this.props.onError} 
                                    showMessage={this.props.showMessage} 
                                    event={this.state.oldEvent}
                                />
                            </div>
                        </div>
                        : <div/>
                }
                
                <ConfirmButton onClick={this.state.onUpdate ? this.updateEvent : this.createEvent} />

            </form>
        )
    }
}

export default EventEditor