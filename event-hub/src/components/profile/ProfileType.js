import React from 'react'
import {Route} from 'react-router-dom'
import Api from '../../services/api/Api'

import { RedirectComponent, LoginRedirect } from '../redirect/Redirect'
import { Profile, UserFriends } from './Profile'

class AbstractProfile extends React.Component {

    constructor(props) {
        super(props)
        
        this.state = {
            name: "",
            avatar: undefined,
            organization: false,
            points: 0,
            linkedUsers: [],
            pastEvents: [],
            futureEvents: []
        }

        let toShow = this.displayWindowSize()
        this.state.avatarsToShow = toShow[0]
        this.state.emptyAvatarSize = toShow[1]

        this.state.name =  "Giancarlo"
        this.state.avatar = "gatto.jpeg"
        this.state.organization = false
        this.state.points =  320
        this.state.linkedUsers = require("../../utils/Utils").dummyLinkedUserList
    }

    displayWindowSize = () => {
        let width = window.innerWidth;
        if(width < 767.98){
            return [3,4]
        } else if (width > 767.98 && width < 991.98){
            return [7,5]
        } else if (width > 991.98 && width < 1199.98){
            return [10,6]
        } else {
            return [12,7]
        }
    };

    componentDidMount = () => {
        window.onresize = () => {
            let toShow = this.displayWindowSize()
            this.setState({avatarsToShow: toShow[0], emptyAvatarSize: toShow[1]})
        }
    }

    componentWillUnmount = () => {
        window.onresize = undefined
    }

    getUserInformation = () => {
        Api.getUserInformation(
            this.state._id,
            () => this.props.onError("Si è verificato un errore durante l'ottenimento dei dati"),
            response => {
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
            }
        )
    }

    changeState = (newState) => {
        this.setState(newState)
    }

    render = () => {
        return <div></div>
    }

}

class PersonalProfile extends AbstractProfile {

    constructor(props){
        super(props)
        if(!!props.isLogged){
            this.state._id = props.userId
            this.getUserInformation()
        }
    }

    render = () => {
        return (
            <div>
                <Profile {...this.props} isLocalUser={true} updateState={this.changeState} state={this.state}/>} />
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
        this.state._id = this.props.match.params.id
        this.getUserInformation()
    }

    render = () => {
        return (
            <div>
                <Route 
                    path={"/users/:id/friends"}
                    exact 
                    render={() => {
                        return <UserFriends {...this.props}
                            linkedUsers={this.state.linkedUsers}
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
                            state={this.state}
                            userId={this.props.user._id}
                        />
                    }}
                />
                <RedirectComponent {...this.props}
                    to={'/profile'}
                    redirectNow={this.props.isLogged && this.props.user._id === this.state._id}
                />
            </div>
        )
    }
}

export { UserProfile, PersonalProfile} 