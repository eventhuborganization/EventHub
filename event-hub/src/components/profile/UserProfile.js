import React from 'react';

import MultipleEventCard from '../multiple_event_card/MultipleEventCard'
import {ProfileAction, ProfileBadge, LinkedUsersBanner, BadgeBanner, ProfileControls} from './Profiles'
import { RedirectComponent } from '../redirect/Redirect';

let images = require.context("../../assets/images", true)

class UserProfile extends React.Component {

    constructor(props) {
        super(props)
        
        this.state = {
            _id: props.isLocalUser ? props.userId : props.match.params.id,
            name: "Grant Gustin",
            avatar: "user-profile-image.jpg",
            organizator: false,
            points: 346,
            linkedUsers: [
                {
                    avatar: "gatto.jpeg",
                    _id: "ciao1"
                },
                {
                    avatar: "gatto.jpeg",
                    _id: "ciao2"
                },
                {
                    avatar: "gatto.jpeg",
                    _id: "ciao3"
                },
                {
                    avatar: "gatto.jpeg",
                    _id: "ciao4"
                },
                {
                    avatar: "gatto.jpeg",
                    _id: "ciao5"
                },
                {
                    avatar: "gatto.jpeg",
                    _id: "ciao6"
                },
                {
                    avatar: "gatto.jpeg",
                    _id: "ciao7"
                }
            ],
            pastEvents: [{
                _id: "1",
                name: "Evento della madonna",
                description: "Una madonna madonnesca",
                typology: "sport",
                thumbnail: "campo-calcio.png",
                organizator: {
                    name: "Pippo"
                },
                maxParticipants: 100,
                numParticipants: 37
            }],
            futureEvents: []
        }
    }

    getEventsByUserTypology = () => {
        let initialString = "Non " + (this.props.isLocalUser ? "hai" : "ha")
        return this.state.organizator ? 
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
                        <img src={images(`./${this.state.avatar}`)} className="card-img img-fluid" alt="Immagine profilo utente"/>
                        <div className="card-img-overlay text-white">
                            <div className="d-flex align-items-start flex-column h-100">
                                <ProfileControls 
                                    {...this.props}
                                    isLocalUser={this.props.isLocalUser}
                                    isMyFriend={isMyFriend} 
                                    _id={this.state._id}
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
                                                show={!this.props.isLocalUser && !isMyFriend}
                                            />
                                            <ProfileAction
                                                iconName={"street-view"}
                                                show={!this.props.isLocalUser && isMyFriend}
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
                        typology={this.state.organizator ? "Followers" : "Amici"}
                    />
                </section>

                {events}
            </main>
        )
    }
}

export default UserProfile