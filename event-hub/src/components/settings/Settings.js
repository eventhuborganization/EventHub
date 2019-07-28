import React from 'react'
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
                <ScrollableMenuTab tabs={[
                    this.createSingleTab("Modifica dati personali", <ChangeInfo {...this.props} user={this.props.user}/>),
                    this.createSingleTab("Modifica credenziali", <ChangeCredentials {...this.props} oldEmail={this.props.user.email}/>),
                    this.createSingleTab("Modifica impostazioni privacy", <div>privacy</div>)
                ]} title="Impostazioni" style={style}/>
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
            </div>
        )
    }

}

export default Settings