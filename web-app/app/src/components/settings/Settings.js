import React from 'react'
import {LoginRedirect} from '../redirect/Redirect'
import { ScrollableMenuTab } from '../menu_tab/MenuTab'
import { ChangeCredentials, ChangeInfo } from './SettingsElements'


class Settings extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            redirectComponent: undefined
        }
    }

    createSingleTab = (tag, elem, onClick) => {
        return Object.freeze({ tag: tag, elem: elem, onClick: onClick})
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
                        />)
                ]} title="Impostazioni" style={style}/>
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
            </div>
        )
    }

}

export default Settings