import React from 'react'
import {Link} from 'react-router-dom'
import styles from './MultipleElementsBanner.module.css'
import {BORDER_PRIMARY, EmptyAvatar, PLACEHOLDER_USER_CIRCLE, RoundedSmallImage, MoreAvatar} from "../image/Image"
import Api from '../../services/api/Api'
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder";
import ResizeService from "../../services/Resize/Resize"

let routes = require("../../services/routes/Routes")

function UserAvatar(props){
    return (
        <Link 
            className={"col " + (!!props.margin ? "" : "pr-0")}
            style={{textDecoration: "none"}}
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
        <Link to={props.moreUsersLink} className="col" style={{textDecoration: "none"}}>
                <MoreAvatar borderType={BORDER_PRIMARY} placeholderType={PLACEHOLDER_USER_CIRCLE}/>
        </Link>
    )
}

function MultipleElementsBanner(props){
    let iconClass = props.iconName ? "fas fa-" + props.iconName : ""
    let padding = props.noPadding ? " px-0 " : ""
    return (
        <div>
            <div className={"row " + padding + (props.margin ? props.margin : "" )}>
                <div className={"col" + padding}>
                    <div className={props.level}><em className={iconClass + " " + styles.bannerTitleIcon}></em> <span className={styles.bannerTitle}> {props.title} </span></div>
                </div>
            </div>
            {
                props.elements.length > 0 ?
                    <div className={"row "}>{props.elements}</div> :
                    <NoItemsPlaceholder placeholder={props.emptyLabel} />
            }
        </div>
    )
}

class MultipleUsersBanner extends React.Component {

    code = undefined

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
        if(width < 768){
            data = [3,4]
        } else if (width >= 768 && width < 992){
            data = [5,5]
        } else if (width >= 992 && width < 1200){
            data = [7,6]
        } else {
            data = [7,7]
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
        this.code = ResizeService.addSubscription(() => {
            let toShow = this.displayWindowSize()
            this.setState({
                avatarsToShow: toShow[0],
                emptyAvatarSize: toShow[1]
            })
        })
    }

    componentWillUnmount = () => {
        if (this.code >= 0)
            ResizeService.removeSubscription(this.code)
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