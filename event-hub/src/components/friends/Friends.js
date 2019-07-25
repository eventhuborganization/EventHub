import React from 'react'
import Api from '../../services/api/Api'

import './Friends.css'
import UserBanner from '../user_banner/UserBanner'

/*class Friends extends React.Component {

    constructor(props){
        super(props)
        this.state = props.state
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

}*/

class Friends extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            filter: "",
            friends: props.friends.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        }
        this.state.result = this.props.isLogged ? 
            <div className="text-center mt-1">
                <div className="row border-bottom d-flex justify-content-center"><h4>I tuoi amici</h4></div> 
                {this.getAllFriends()}
            </div> : <EmptyList description="Esegui il login per vedere i tuoi amici"/>
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
        let list =  this.getFriends(
            elem => elem.name.toLowerCase().includes(this.state.filter.toLowerCase()),
            () => false,
            () => {}
        )
        return list.length > 0 ? list : <EmptyList description={<div>La tua lista amici è vuota.<br/>Incontra nuova gente!</div>}/>
    }

    getFriends = (filterFun, showFun, onAddFriendFun) => {
        let x = 0;
        return this.state.friends
                   .filter(elem => filterFun(elem))
                   .map(elem => {
                        let id = "friend" + x++
                        return (
                            <UserBanner key={id}
                                user={elem}
                                showAddFriendButton={showFun(elem)}
                                onAddFriend={() => onAddFriendFun(elem)}
                            />
                        )
                    })
    }

    render = () => {
        return (
            <div className="main-container">
                <nav className="sticky-top row navbar navbar-light bg-light border-bottom border-primary px-0">
                    <h1 className="col-2 navbar-brand text-primary mx-0 mb-0 font-weight-bold">EH</h1>
                    <form className="col form-inline container-fluid px-1">
                        <div className="row w-100 mx-0 d-flex justify-content-between">
                            <label htmlFor="tf-search" className="d-none">Cerca persona</label>
                            <label htmlFor="btn-search" className="d-none">Bottone di ricerca</label>
                            <input
                                className="col-10 form-control" 
                                id="tf-search" 
                                name="tf-search" 
                                type="search" 
                                placeholder="Cerca una persona"
                                value={this.state.filter}
                                onChange={this.onFilter}
                            />
                            <button id="btn-search" name="btn-search" className="col ml-1 btn btn-success" type="submit">
                                <em className="fas fa-search" aria-hidden="true"></em>
                            </button>
                        </div>
                    </form>
                </nav>
                {
                    this.props.isLogged ? 
                    <div className="text-center mt-1">
                        <div className="row border-bottom d-flex justify-content-center"><h4>I tuoi amici</h4></div> 
                        {this.getAllFriends()}
                    </div> : 
                    <EmptyList description="Esegui il login per vedere i tuoi amici"/>
                }
            </div>
        )
    }
}

function EmptyList(props){
    return (
        <div className="row mt-3">
            <div className="col-10 mx-auto empty-list p-3">{props.description}</div>
        </div>
    )
}

export default Friends