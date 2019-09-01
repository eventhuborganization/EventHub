import React from 'react'
import {Link} from 'react-router-dom'
import styles from './MultipleElementsBanner.module.css'
import {BORDER_PRIMARY, EmptyAvatar, PLACEHOLDER_USER_CIRCLE, RoundedSmallImage, MoreAvatar} from "../image/Image"
import Api from '../../services/api/Api'

let routes = require("../../services/routes/Routes")

function UserAvatar(props){
    return (
        <Link 
            className={"col " + (!!props.margin ? "" : "pr-0")} 
            to={routes.userFromId(props.user._id)}>
            <RoundedSmallImage imageName={props.user.avatar} borderType={BORDER_PRIMARY} placeholderType={PLACEHOLDER_USER_CIRCLE}/>
        </Link>
    )
}

function EmptyUserAvatar(props){
    return (
        <div className={"col " + (!!props.margin ? "" : " pr-0 ")}>
            <EmptyAvatar borderType={BORDER_PRIMARY} placeholderType={PLACEHOLDER_USER_CIRCLE}/>
        </div>
    )
}

function MoreUsers(props){
    return (
        <Link to={props.moreUsersLink} className="col">
                <MoreAvatar borderType={BORDER_PRIMARY} placeholderType={PLACEHOLDER_USER_CIRCLE}/>
        </Link>
    )
}

function MultipleElementsBanner(props){
    let iconClass = props.iconName ? "fas fa-" + props.iconName : ""
    return (
        <div>
            <div className={"row " + (props.noPadding ? " px-0 " : "") + (props.margin ? props.margin : "" )}>
                <div className={"col" + (props.noPadding ? " px-0" : "")}>
                    <div className={props.level}><em className={iconClass}></em> {props.title}</div>
                </div>
            </div>
            <div className="row">
                {
                    props.elements.length > 0 ? props.elements : 
                    <div className={"col-11 col-md-6 mx-auto border border-primary p-2 " + styles.emptyList}> 
                        {props.emptyLabel} 
                    </div>
                }
            </div>
        </div>
    )
}

class MultipleUsersBanner extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            users: props.users
        }
        let toShow = this.displayWindowSize()
        this.state.avatarsToShow = toShow[0]
        this.state.emptyAvatarSize = toShow[1]
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps !== this.props){
            if(this.props.usersInfoIncomplete){
                this.loadUsersInfo(this.props.users, this.state.avatarsToShow)
            } else {
                this.setState({users: this.props.users})
            }
        }
    }

    displayWindowSize = () => {
        let width = window.innerWidth;
        let data;
        if(width < 767.98){
            data = [3,4]
        } else if (width > 767.98 && width < 991.98){
            data = [7,5]
        } else if (width > 991.98 && width < 1199.98){
            data = [10,6]
        } else {
            data = [12,7]
        }
        this.loadUsersInfo(this.props.users, data[0] + 1)
        return data
    }

    loadUsersInfo = (users, limit) => {
        if(this.props.usersInfoIncomplete){
            let shownUsers = users.slice(0, limit + 1)
            Api.getUsersInformation(
                shownUsers, 
                (err) => console.log(err),
                usersDetail => {
                    usersDetail.forEach(user => {
                        let index = users.findIndex(u => u._id === user._id)
                        users[index] = user
                    })
                    this.setState({users: users})
                }
            )
        }
    } 

    componentDidMount = () => {
       window.onresize = () => {
            let toShow = this.displayWindowSize()
            this.setState({
                avatarsToShow: toShow[0],
                emptyAvatarSize: toShow[1]
            })
        }
    }

    componentWillUnmount = () => {
        window.onresize = undefined
    }

    render = () => {
        let users = this.state.users
        let limit = this.state.avatarsToShow
        let avatars = []
        if(users.length > 0){
            for(let x = 0; x < limit; x++){
                avatars.push(x >= users.length ? 
                    <EmptyUserAvatar key={"av" + x}/> 
                    : <UserAvatar user={users[x]} key={"av" + x} emptyAvatarSize={this.state.emptyAvatarSize}/>)
            }
            if(users.length > limit + 1){
                avatars.push(<MoreUsers key={"av" + (limit + 1)} moreUsersLink={this.props.moreUsersLink}/>)
            } else if(users.length === limit + 1){
                avatars.push(<UserAvatar user={users[3]} margin={true} key={"av" + (limit + 1)} emptyAvatarSize={this.state.emptyAvatarSize}/>)
            } else {
                avatars.push(<EmptyUserAvatar margin={true} key={"av" + (limit + 1)}/>)
            }
        }

        return (
            <MultipleElementsBanner
                elements={avatars}
                title={this.props.typology}
                iconName={this.props.iconName}
                emptyLabel={this.props.emptyLabel}
                noPadding={this.props.noPadding}
                level={this.props.level}
                margin={this.props.margin}
            />
        )
    }
}

export {MultipleElementsBanner, MultipleUsersBanner}