import React from 'react';
import axios from 'axios';
import MultipleEventCard from '../multiple_event_card/MultipleEventCard'
import {ProfileAction, ProfileBadge, LinkedUsersBanner, BadgeBanner, ProfileControls} from './Profiles'
import { RedirectComponent } from '../redirect/Redirect';

/**
 * I badge sono ancora da gestire!!!
 */
class UserProfile extends React.Component {

    constructor(props) {
        super(props)
        
        this.state = {
            _id: props.isLocalUser ? props.userId : props.match.params.id,
            name: "",
            avatar: undefined,
            organization: false,
            points: 0,
            linkedUsers: [],
            pastEvents: [],
            futureEvents: []
        }

        this.getUserInformation()
    }

    getUserInformation = () => {
        axios.get(this.props.mainServer + "/users/" + this.state._id)
            .then(response => {
                if(response.status === 200){
                    let name = response.data.name + (response.data.organization ? "" : " " + response.data.surname)
                    let futureEvents =  response.data.eventsSubscribed.filter(x => x.date > Date.now())
                    let pastEvents =  response.data.eventsSubscribed.filter(x => x.date < Date.now())
                    this.setState({
                        name: name,
                        avatar: response.data.avatar,
                        organization: response.data.organization,
                        linkedUsers: response.data.linkedUsers,
                        badges: response.data.badges,
                        points: response.data.points,
                        futureEvents: futureEvents,
                        pastEvents: pastEvents,
                        groups: response.data.groups
                    })
                } else {
                    let errorMsg = response.data.description ? response.data.description : "Si è verificato un errore durante l'ottenimento dei dati"
                    this.props.onError(errorMsg)
                }
            })
            .catch(() => this.props.onError("Si è verificato un errore durante l'ottenimento dei dati"))
    }

    getEventsByUserTypology = () => {
        let initialString = "Non " + (this.props.isLocalUser ? "hai" : "ha")
        return this.state.organization ? 
            (<div>
                <section className="mt-3">
                    <MultipleEventCard
                        {...this.props}
                        events={this.state.pastEvents}
                        iconName={"glass-cheers"} 
                        title={"Eventi organizzati"}
                        emptyListLabel={ initialString + " ancora organizzato un evento"}
                    />
                </section>
            </div>) : 
            (<div> 
                <section className="mt-3">
                    <MultipleEventCard
                        {...this.props}
                        events={this.state.futureEvents}
                        iconName={"glass-cheers"} 
                        title={"Prossimi eventi"}
                        emptyListLabel={initialString + " nessun prossimo evento in programma"}
                    />
                </section>
                <section className="mt-3">
                    <MultipleEventCard
                        {...this.props}
                        events={this.state.pastEvents}
                        iconName={"glass-cheers"} 
                        title={"Ultimi eventi a cui " + (this.props.isLocalUser ? "hai" : "ha" ) + " partecipato"}
                        emptyListLabel={initialString + " partecipato a nessun evento"}
                    />
                </section>
            </div>)
    }

    selectAvatar = (event) => {
        console.log(event.target.name)
        if(this.props.isLocalUser && event.target.name !== "ciaooo")
            document.getElementById("chooseAvatar").click()
    }

    addFriend = () => {
        if(!this.props.isLocalUser){
            this.sendRequest("/users/friendship", "Si è verificato un errore durante la richiesta, riprova")
        }
    }

    requestPosition = () => {
        if(!this.props.isLocalUser){
            this.sendRequest("/users/friendposition", "Si è verificato un errore durante la richiesta di posizione, riprova")
        }
    }

    sendRequest = (link, errorMessage) => {
        if(!this.props.isLocalUser){
            axios.post(this.props.mainServer + link, {friend: this.state._id})
                .then(result => {
                    if(result.status !== 200){
                        this.props.onError(result.data.description ? 
                            result.data.description
                            : errorMessage)
                    }
                })
                .catch(() => this.props.onError(errorMessage))
        }
    }

    removeFriend = () => {
        if(!this.props.isLocalUser){
            axios.delete(this.props.mainServer + "/users/friendship", {friend: this.state._id})
                .then(result => {
                    if(result.status === 200){
                        this.setState({linkedUsers: result.linkedUsers.filter(elem => elem._id != this.props.userId)})
                    } else {
                        this.props.onError(result.data.description ? 
                            result.data.description
                            : "Si è verificato un errore durante la richiesta, riprova")
                    }
                })
                .catch(() => this.props.onError("Si è verificato un errore durante la richiesta, riprova"))
        }
    }

    render() {
        let isMyFriend = !this.props.isLocalUser && 
            this.state.linkedUsers.findIndex(elem => elem._id === this.props.userId) >= 0

        let events = this.getEventsByUserTypology()
        return (
            <main className="main-container">

                <RedirectComponent {...this.props}
                    to={'/profile'}
                    redirectNow={!this.props.isLocalUser && this.props.userId === this.state._id}
                />

                <section className="row">
                    <div className="col card bg-dark px-0">
                        <div className="card-img px-0 text-center bg-dark" >
                            <div className={"text-secondary" + (this.state.avatar ? " d-none" : "" )}>
                                <em className="far fa-image fa-10x"></em>
                            </div>
                            <img src={this.state.avatar} 
                                className={"img-fluid"  + (this.state.avatar ? "" : " d-none")} 
                                alt="Immagine profilo utente"
                            />
                        </div>
                        <div className="card-img-overlay text-white">
                            <div className="d-flex align-items-start flex-column h-100">
                                <ProfileControls 
                                    {...this.props}
                                    isLocalUser={this.props.isLocalUser}
                                    isMyFriend={isMyFriend} 
                                    _id={this.state._id}
                                    settingsClicked={this.settings}
                                    removeClicked={this.removeFriend}
                                />
                                <div className="container-fluid mt-auto">
                                    <div className="row">
                                        <div className="col d-flex justify-content-between px-2 align-items-center font-weight-bold">
                                            <ProfileBadge
                                                iconName={"trophy"}
                                                number={this.state.points} 
                                            />
                                            <ProfileAction
                                                iconName={"plus"}
                                                id="ciaooo"
                                                show={!this.props.isLocalUser && !isMyFriend}
                                                actionSelected={this.addFriend}
                                            />
                                            <ProfileAction
                                                iconName={"street-view"}
                                                show={!this.props.isLocalUser && isMyFriend && !this.state.organization}
                                                actionSelected={this.requestPosition}
                                            />
                                            <ProfileBadge
                                                iconName={"address-card"}
                                                number={this.state.linkedUsers.length} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="row mt-2">
                    <h2 className="col text-center">{this.state.name}</h2>
                </section>

                <section className="mt-2">
                    <BadgeBanner badge={{
                        name: "Il razzo",
                        description: "Fai più di 15 recensioni"
                    }}/>
                </section>

                <section className="mt-3">
                    <LinkedUsersBanner 
                        linkedUsers={this.state.linkedUsers}
                        emptyLabel={"Non " + (this.props.isLocalUser ? "hai" : "ha") + " alcun " + (this.state.organization ? "follower" : "amico")}
                        typology={this.state.organization ? "Followers" : "Amici"}
                    />
                </section>

                {events}
            </main>
        )
    }
}

export default UserProfile