import React from 'react'
import Api from '../../services/api/Api'

import {ProfileAction, ProfileBadge, LinkedUsersBanner, BadgeBanner, EventsBanner, ProfileControls} from './Profiles'
import { UserBanner } from '../link_maker_banner/LinkMakerBanner'
import { FriendsTab } from '../menu_tab/MenuTab'
import { CallableComponent } from '../redirect/Redirect'
import {AVATAR, ImageForCard} from "../image/Image"
import { SimpleSearchBar } from '../search_bar/SearchBar'

let routes = require("../../services/routes/Routes")

/**
 * I badge sono ancora da gestire!!!
 */
class Profile extends CallableComponent {

    constructor(props){
        super(props)
        this.state = {
            user: props.user
        }
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.location.pathname !== this.props.location.pathname) {
            this.props.updateInfo()
        }
    }

    getEventsByUserTypology = () => {
        let initialString = "Non " + (this.props.isLocalUser ? "hai" : "ha")
        let user = this.props.isLocalUser ? this.state.user : this.props.localUser
        return this.state.user.organization ? 
            (<div>
                <section className="mt-3">
                    <EventsBanner
                        {...this.props}
                        user={user}
                        events={this.state.user.futureEvents}
                        title={"Eventi futuri"}
                        emptyLabel={ initialString + " organizzato eventi futuri"}
                    />
                </section>
                <section className="mt-3">
                    <EventsBanner
                        {...this.props}
                        user={user}
                        events={this.state.user.pastEvents}
                        title={"Eventi organizzati"}
                        emptyLabel={ initialString + " ancora organizzato un evento"}
                    />
                </section>
            </div>) : 
            (<div> 
                <section className="mt-3">
                    <EventsBanner
                        {...this.props}
                        user={user}
                        events={this.state.user.futureEvents}
                        title={"Prossimi eventi"}
                        emptyLabel={initialString + " nessun prossimo evento in programma"}
                    />
                </section>
                <section className="mt-3">
                    <EventsBanner
                        {...this.props}
                        user={user}
                        events={this.state.user.pastEvents}
                        title={"Ultimi eventi a cui " + (this.props.isLocalUser ? "hai" : "ha" ) + " partecipato"}
                        emptyLabel={initialString + " partecipato a nessun evento"}
                    />
                </section>
            </div>)
    }

    addFriend = () => {
        let errorFun = () => this.props.onError("Si è verificato un errore durante la richiesta, riprova")
        if(!this.props.isLocalUser){
            if(this.state.user.organization){
                Api.followOrganization(
                    this.state.user._id,
                    errorFun,
                    () => {
                        let newFriends = this.state.user.linkedUsers
                        newFriends.push(this.props.localUser)
                        this.props.updateState({linkedUsers: newFriends})
                        this.props.manageLinkedUser(this.state.user, true)
                        this.setState((prevState) => {
                            prevState.user.linkedUsers = newFriends
                            return prevState
                        })
                    }
                )
            } else {
                Api.sendFriendshipRequest(
                    this.state.user._id,
                    errorFun,
                    () => {
                        let btn = document.getElementById("addButton")
                        btn.classList.add("disabled")
                        this.props.onSuccess("Richiesta d'amicizia inviata!")
                    }
                )
            }
        }
    }

    requestPosition = () => {
        if(!this.props.isLocalUser && !this.state.organization){
            Api.sendFriendPositionRequest(
                this.state.user._id,
                () => this.props.onError("Si è verificato un errore durante la richiesta di posizione, riprova"),
                () => this.props.onSuccess("Posizione richiesta con successo!")
            )
        }
    }

    removeFriend = () => {
        if(!this.props.isLocalUser){
            Api.removeFriend(
                this.state.user._id, 
                () => this.props.onError("Si è verificato un errore durante la richiesta, riprova"),
                () => {
                    let list = this.state.user.linkedUsers.filter(elem => elem._id !== this.props.localUser._id)
                    this.props.updateState({linkedUsers: list})
                    this.props.manageLinkedUser(this.state.user, false)
                    this.setState((prevState) => {
                        prevState.user.linkedUsers = list
                        return prevState
                    })
                }
            )
        }
    }

    newData = (value) => {
        this.setState({user: value})
    }

    render() {
        let isMyFriend = !this.props.isLocalUser && this.props.isLogged &&
            this.state.user.linkedUsers.findIndex(elem => elem._id === this.props.localUser._id) >= 0

        let events = this.getEventsByUserTypology()
        let lastBadge = this.state.user.badges && this.state.user.badges.length !== 0 ? this.state.user.badges[this.state.badges.length - 1] : ""
        return (
            <main className="main-container">
                <section className="row">
                    <div className="col card bg-dark px-0">
                        <div className="card-img px-0 text-center bg-dark" style={{minHeight: 150}}>
                            <ImageForCard imageName={this.state.user.avatar} type={AVATAR}/>
                        </div>
                        <div className="card-img-overlay text-white">
                            <div className="d-flex align-items-start flex-column h-100">
                                <ProfileControls 
                                    {...this.props}
                                    isLocalUser={this.props.isLocalUser}
                                    isMyFriend={isMyFriend} 
                                    _id={this.state.user._id}
                                    settingsLink={routes.settings}
                                    removeClicked={this.removeFriend}
                                />
                                <div className="container-fluid mt-auto">
                                    <div className="row">
                                        <div className="col d-flex justify-content-between px-2 align-items-center font-weight-bold">
                                            <ProfileBadge
                                                iconName={"trophy"}
                                                number={this.state.user.points >= 0 ? this.state.user.points : 0} 
                                            />
                                            <ProfileAction
                                                id="addButton"
                                                iconName={"plus"}
                                                show={!this.props.isLocalUser && !isMyFriend 
                                                    && this.props.isLogged && !this.props.localUser.organization}
                                                actionSelected={this.addFriend}
                                            />
                                            <ProfileAction
                                                iconName={"street-view"}
                                                show={!this.props.isLocalUser && isMyFriend && !this.state.user.organization && !this.props.localUser.organization && this.props.isLogged}
                                                actionSelected={this.requestPosition}
                                            />
                                            <ProfileBadge
                                                iconName={"users"}
                                                number={this.state.user.linkedUsers.length} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="row mt-2">
                    <h2 className="col text-center">
                        {
                            this.state.user.organization ? 
                            <div><em className="text-secondary fas fa-user-tie"></em> {this.state.user.name}</div> :
                            <div>{this.state.user.name + " " + this.state.user.surname}</div>
                        }
                    </h2>
                </section>

                <section className="mt-2">
                    <BadgeBanner badge={lastBadge} emptyLabel="Nessun badge guadagnato al momento"/>
                </section>

                <section className="mt-3">
                    <LinkedUsersBanner 
                        linkedUsers={this.state.user.linkedUsers}
                        emptyLabel={"Non " + (this.props.isLocalUser ? "hai" : "ha") + " alcun " + (this.state.user.organization ? "follower" : "amico")}
                        typology={this.state.user.organization ? "Followers" : "Amici"}
                        moreLinkedUsersLink={this.props.isLocalUser ? routes.myFriends : routes.usersFriendsFromPath(this.props.match.url)}
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
        let errorFun = () => this.props.onError("Si è verificato un errore durante la richesta, riprova")
        if(friend.organization){
            Api.followOrganization(
                friend._id,
                errorFun,
                () => {
                    this.disableFriendButton(friend, "Segui")
                    this.setState((prevState) => {
                        let state = prevState
                        state.linkedUsers.push(friend)
                        state.linkedUsers.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                        return state
                    })
                }
            )
        } else {
            Api.sendFriendshipRequest(
                friend._id,
                errorFun,
                () => this.disableFriendButton(friend, "In Attesa")
            )
        }
    }

    disableFriendButton = (friend, text) => {
        let button = document.getElementById("friendBtn" + friend._id)
        button.innerHTML = text
        button.classList.add("disabled")
        button.blur()
    }

    cantAddFriend = (friend) => {
        return !this.props.isLogged || this.props.localUser.linkedUsers.includes(friend) || friend._id === this.props.localUser._id
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
                <SimpleSearchBar
                    placeholder="Cerca amico"
                    value={this.state.filter}
                    onChange={this.onFilter}
                />
                <FriendsTab tabs={tabs} />
            </div>
        )
    }
}

export {Profile, UserFriends}