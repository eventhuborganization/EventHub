import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Api from '../../services/api/Api'

import { LoginRedirect } from '../redirect/Redirect'
import { Profile, UserFriends } from './Profile'

let routes = require("../../services/routes/Routes")

class AbstractProfile extends React.Component {

    constructor(props) {
        super(props)
        
        this.state = {
            profileComp: undefined,
            redirectHome: false,
            user: {
                name: "",
                surname: "",
                address: {
                    city: "",
                    address: "",
                    province: ""
                },
                avatar: undefined,
                organization: false,
                points: 0,
                linkedUsers: [],
                pastEvents: [],
                futureEvents: []
            },
            userFound: false,
        }
    }

    getUserInformation = (callback) => {
        Api.getUserInformation(
            this.state.user._id,
            () => 
                this.props.onError(
                    "Si è verificato un errore durante l'ottenimento dei dati, verrai ridirezionato alla homepage", 
                    () => {}, () => this.setState({redirectHome: true})
                ),
            user => {
                let events = user.organization ? user.eventsOrganized : user.eventsSubscribed
                let futureEvents =  events.filter(x => x.date > Date.now())
                let pastEvents =  events.filter(x => x.date < Date.now())
                let data = {...user}
                data.futureEvents = futureEvents
                data.pastEvents = pastEvents
                data.linkedUsers.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                if(this.state.profileComp){
                    this.state.profileComp.newData(data)
                }
                if(callback instanceof Function){
                    callback(user)
                }
                this.setState({user: data, userFound: true})
            }
        )
    }

    changeState = (newState) => {
        this.setState({user: newState})
    }

    setProfileComponent = (component) => {
        this.setState({profileComp: component})
    }

    redirectToHome = () => {
        return this.state.redirectHome ? 
            <Redirect from={this.props.from} to={routes.home} /> : <div/>
    }

    render = () => {
        return <div></div>
    }

}

class PersonalProfile extends AbstractProfile {

    constructor(props){
        super(props)
        this.state.userFound = true
        if(!!props.isLogged) {
            this.state.user = {...props.user}
            if(!this.state.user.pastEvents)
                this.state.user.pastEvents = []
            if(!this.state.user.futureEvents)
                this.state.user.futureEvents = []
            this.getUserInformation(user => {
                props.updateUser(user)
            })
        }
    }

    render = () => {
        return (
            <div>
                {this.redirectToHome()}
                <Profile {...this.props} 
                    isLocalUser={true} 
                    updateState={this.changeState} 
                    user={this.state.user}
                    onRef={this.setProfileComponent}
                    userFound={this.state.userFound}/>
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
            </div>
        )
    }

}

class UserProfile extends AbstractProfile {

    constructor(props){
        super(props)
        this.updateInformation()
    }

    updateInformation = () => {
        this.state.user._id = this.props.match.params.id
        this.state.userFound = false
        if(this.props.match.params.id !== this.props.user._id){
            this.getUserInformation()
        }
    }

    redirectToProfile = () => {
        return this.props.user._id === this.props.match.params.id ? 
            <Redirect from={this.props.from} to={routes.myProfile} /> : <div/>
    }

    render = () => {
        return (
            <div>
                {this.redirectToHome()}
                {this.redirectToProfile()}
                <Route 
                    path={routes.userFriends}
                    exact 
                    render={() => {
                        return <UserFriends {...this.props}
                            linkedUsers={this.state.user.linkedUsers}
                            localUser={this.props.user}
                        />
                    }} 
                />
                <Route
                    exact
                    path={this.props.match.path}
                    render={() =>{
                        return <Profile {...this.props}
                            updateInfo={this.updateInformation} 
                            isLocalUser={false} 
                            updateState={this.changeState} 
                            user={this.state.user}
                            localUser={this.props.user}
                            userFound={this.state.userFound}
                            onRef={this.setProfileComponent}
                        />
                    }}
                />
            </div>
        )
    }
}

export { UserProfile, PersonalProfile} 