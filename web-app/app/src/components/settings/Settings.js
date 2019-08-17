import React from 'react'
import {LoginRedirect, RedirectComponent} from '../redirect/Redirect'
import { ScrollableMenuTab } from '../menu_tab/MenuTab'
import { ChangeCredentials, ChangeInfo } from './SettingsElements'


class Settings extends React.Component {

    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            redirectComponent: undefined
        }
    }

    createSingleTab = (tag, elem, onClick) => {
        return Object.freeze({ tag: tag, elem: elem, onClick: onClick})
    }

    logout = () => {
        if (this.state.redirectComponent) {
            this.props.logout()
            this.state.redirectComponent.setRedirect(true)
        }
    }

    render() {
        let style = {
            navbarBackground: "bg-dark",
            link: "text-white",
            title: "text-white",
            button: "border border-white"
        }
       return (
            <div className="main-container">
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                <ScrollableMenuTab tabs={[
                    this.createSingleTab(
                        "Modifica dati personali", 
                        <ChangeInfo {...this.props} 
                            user={this.props.isLogged ? this.props.user : {}}
                            onChange={this.props.onChangeUserInfo}
                        />),
                    this.createSingleTab(
                        "Modifica credenziali", 
                        <ChangeCredentials {...this.props} 
                            user={this.props.isLogged ? this.props.user : {}}
                            onChange={this.props.onChangeUserInfo}
                        />),
                    this.createSingleTab(
                        <div>
                            <RedirectComponent
                                from={this.props.location.pathname} to={"/"}
                                onRef={ref => this.setState({redirectComponent: ref})}
                            />
                            Logout
                        </div>,
                        <div/>,
                        this.logout)
                ]} title="Impostazioni" style={style}/>
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
            </div>
        )
    }

}

export default Settings