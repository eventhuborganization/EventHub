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
                avatar: undefined,
                organization: false,
                points: 0,
                linkedUsers: [],
                pastEvents: [],
                futureEvents: []
            }
        }
    }

    getUserInformation = () => {
        Api.getUserInformation(
            this.state.user._id,
            () => 
                this.props.onError(
                    "Si è verificato un errore durante l'ottenimento dei dati, verrai ridirezionato alla homepage", 
                    () => {}, () => this.setState({redirectHome: true})
                ),
            user => {
                let name = user.name + (user.organization ? "" : " " + user.surname)
                let futureEvents =  user.eventsSubscribed.filter(x => x.date > Date.now())
                let pastEvents =  user.eventsSubscribed.filter(x => x.date < Date.now())
                let data = {
                    _id : user._id,
                    name: name,
                    avatar: user.avatar,
                    organization: user.organization,
                    linkedUsers: user.linkedUsers,
                    badges: user.badges,
                    points: user.points,
                    futureEvents: futureEvents,
                    pastEvents: pastEvents,
                    groups: user.groups
                }
                this.setState({user: data})
                if(this.state.profileComp){
                    this.state.profileComp.newData(data)
                }
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
        if(!!props.isLogged){
            this.state.user._id = props.userId
            this.getUserInformation()
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
                    onRef={this.setProfileComponent}/>
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
                            onRef={this.setProfileComponent}
                        />
                    }}
                />
            </div>
        )
    }
}

export { UserProfile, PersonalProfile} 