import React from 'react'
import Api from '../../services/api/Api'

import MultipleEventCard from '../multiple_event_card/MultipleEventCard'
import {ProfileAction, ProfileBadge, LinkedUsersBanner, BadgeBanner, ProfileControls} from './Profiles'
import UserBanner from '../user_banner/UserBanner'
import {FriendsTab} from '../menu_tab/MenuTab'

/**
 * I badge sono ancora da gestire!!!
 */
class Profile extends React.Component {

    constructor(props){
        super(props)
        this.state = props.state
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.location.pathname !== this.props.location.pathname) {
            this.props.updateInfo()
        }
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

    addFriend = () => {
        if(!this.props.isLocalUser){
            Api.sendFriendshipRequest(
                this.state._id,
                () => this.props.onError("Si è verificato un errore durante la richiesta, riprova"),
                () => {}
            )
        }
    }

    requestPosition = () => {
        if(!this.props.isLocalUser && !this.state.organization){
            Api.sendFriendPositionRequest(
                this.state._id,
                () => this.props.onError("Si è verificato un errore durante la richiesta di posizione, riprova"),
                () => {}
            )
        }
    }

    removeFriend = () => {
        if(!this.props.isLocalUser){
            Api.removeFriend(
                this.state._id, 
                () => this.props.onError("Si è verificato un errore durante la richiesta, riprova"),
                () => 
                    this.props.updateState({linkedUsers: this.state.linkedUsers.filter(elem => elem._id !== this.props.userId)})
            )
        }
    }

    render() {
        let isMyFriend = !this.props.isLocalUser && 
            this.state.linkedUsers.findIndex(elem => elem._id === this.props.userId) >= 0

        let events = this.getEventsByUserTypology()
        return (
            <main className="main-container">

                <section className="row">
                    <div className="col card bg-dark px-0">
                        <div className="card-img px-0 text-center bg-dark" style={{minHeight: 150}}>
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
                                    settingsLink={"/settings"}
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
                                                show={!this.props.isLocalUser && !isMyFriend && this.props.isLogged}
                                                actionSelected={this.addFriend}
                                            />
                                            <ProfileAction
                                                iconName={"street-view"}
                                                show={!this.props.isLocalUser && isMyFriend && !this.state.organization && this.props.isLogged}
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
                        numberToShow={this.state.avatarsToShow}
                        emptyAvatarSize={this.state.emptyAvatarSize}
                        moreLinkedUsersLink={this.props.isLocalUser ? "/friends" : `${this.props.match.url}/friends`}
                    />
                </section>

                {events}
            </main>
        )
    }

}

class UserFriends extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            filter: "",
            linkedUsers: props.linkedUsers.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        }
    }

    onFilter = (event) => {
        this.setState({filter: event.target.value})
    }

    addFriend = (friend) => {
        Api.sendFriendshipRequest(
            friend._id,
            () => this.props.onError("Si è verificato un errore durante la richesta, riprova"),
            () => {}
        )
    }

    cantAddFriend = (friend) => {
        return !this.props.isLogged || this.props.user.linkedUsers.includes(friend) || friend._id === this.props.user._id
    }

    getAllFriends = () => {
        return this.getFriends(
            elem => elem.name.toLowerCase().includes(this.state.filter.toLowerCase()),
            elem => !this.cantAddFriend(elem),
            elem => this.addFriend(elem)
        )
    }

    getAllCommonFriends = () => {
        return this.getFriends(
            elem => elem.name.toLowerCase().includes(this.state.filter.toLowerCase()) && this.cantAddFriend(elem),
            () => false,
            () => {}
        )
    }

    getAllUncommonFriends = () => {
        return this.getFriends(
            elem => elem.name.toLowerCase().includes(this.state.filter.toLowerCase()) && !this.cantAddFriend(elem),
            () => true,
            elem => this.addFriend(elem)
        )
    }

    getFriends = (filterFun, showFun, onAddFriendFun) => {
        let x = 0;
        return this.state.linkedUsers
                   .filter(elem => filterFun(elem))
                   .map(elem => {
                        let id = "friend" + x++
                        return (
                            <UserBanner key={id}
                                border={true}
                                user={elem}
                                showAddFriendButton={showFun(elem)}
                                onAddFriend={() => onAddFriendFun(elem)}
                            />
                        )
                    })
    }

    createSingleTab = (tag, elem) => {
        return Object.freeze({ tag: tag, elem: elem})
    }

    render = () => {
        let tabs = [this.createSingleTab("Tutti", this.getAllFriends())]
        if(this.props.isLogged){
            tabs.push(
                this.createSingleTab("In Comune", this.getAllCommonFriends()),
                this.createSingleTab("Non in Comune", this.getAllUncommonFriends())
            )
        }
        return (
            <div className="main-container">
                <form className="row mb-2 sticky-top bg-white py-2">
                    <label htmlFor="tf-search" className="d-none">Cerca amico</label>
                    <input 
                        className="col-11 mx-auto form-control"
                        id="tf-search" 
                        name="tf-search" 
                        type="search" 
                        placeholder="Cerca amico"
                        value={this.state.filter}
                        onChange={this.onFilter}/>
                </form>
                <FriendsTab tabs={tabs} />
            </div>
        )
    }
}

export {Profile, UserFriends}