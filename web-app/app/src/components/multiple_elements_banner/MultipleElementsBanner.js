import React from 'react'
import {Link} from 'react-router-dom'
import styles from './MultipleElementsBanner.module.css'
import {BORDER_PRIMARY, EmptyAvatar, PLACEHOLDER_USER_CIRCLE, RoundedSmallImage} from "../image/Image"

function UserAvatar(props){
    return (
        <Link 
            className={"col d-flex align-items-center justify-content-center " + (!!props.margin ? "" : "pr-0")} 
            to={"/users/" + props.user._id}>
            <RoundedSmallImage imageName={props.user.avatar} borderType={BORDER_PRIMARY} placeholderType={PLACEHOLDER_USER_CIRCLE}/>
        </Link>
    )
}

function EmptyUserAvatar(props){
    return (
        <div className={"col d-flex justify-content-center " + (!!props.margin ? "" : " pr-0 ")}>
            <EmptyAvatar borderType={BORDER_PRIMARY} placeholderType={PLACEHOLDER_USER_CIRCLE}/>
        </div>
    )
}

function MoreUsers(props){
    return (
        <div className="col d-flex justify-content-center align-items-center">
            <Link 
                to={props.moreUsersLink}
                className={"border border-primary rounded-circle w-100 h-100 d-flex justify-content-center align-items-center " + styles.avatarIcon}>
                    <em className="fas fa-ellipsis-h text-dark"></em>
            </Link>
        </div>
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
        this.state = {}
        let toShow = this.displayWindowSize()
        this.state.avatarsToShow = toShow[0]
        this.state.emptyAvatarSize = toShow[1]
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
        let users = this.props.users
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