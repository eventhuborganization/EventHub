import React from 'react'
import {Link} from 'react-router-dom'
import { LoginRedirect } from '../redirect/Redirect'
import { ScrollableMenuTab } from '../menu_tab/MenuTab'
import { ChangeCredentials, ChangeInfo } from './SettingsElements'


class Settings extends React.Component {

    createSingleTab = (tag, elem) => {
        return Object.freeze({ tag: tag, elem: elem})
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
                    this.createSingleTab(<Link to="/" className={style.link} onClick={this.props.onLogout}>Logout</Link>, <div></div>)
                ]} title="Impostazioni" style={style}/>
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
            </div>
        )
    }

}

export default Settings