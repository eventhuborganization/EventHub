import React from 'react'
import styles from '../login/Login.module.css'
import Api from '../../services/api/Api'
import RegistrationForm from './RegistrationForm'
import { RegistrationTab } from '../menu_tab/MenuTab'
import {LoginRedirect, LoginSuccessfullRedirect} from '../redirect/Redirect'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginRedirect : undefined,
            homeRedirect: undefined
        };
    }

    security = require('js-sha512');
  
    componentDidMount = () => {
        document.getElementById("root").classList.add("p-0", styles.bgImage)
    }

    componentWillUnmount = () => {
        document.getElementById("root").classList.remove("p-0", styles.bgImage)
    }

    setRedirectToLoginRef = (redirectComponent) => {
        this.setState({
            loginRedirect: redirectComponent
        })
    }

    setRedirectToHomeRef = (redirectComponent) => {
        this.setState({
            homeRedirect: redirectComponent
        })
    }

    onRegistration = (data, privateUser) => {
        let hashedPwd = this.security.sha512(data[data.componentIds.password]);
        let message = {
            name: capitalizeFirstLetter(data[data.componentIds.name]),
            email: data[data.componentIds.email],
            address: {
                city: capitalizeFirstLetter(data[data.componentIds.city])
            },
            organization: !privateUser,
            password: hashedPwd,
            avatar: data.avatar 
        };
        if(data[data.componentIds.phone]){
            message.phone = data[data.componentIds.phone]
        }
        if(privateUser){
            message.surname = capitalizeFirstLetter(data[data.componentIds.surname])
            message.gender = data[data.componentIds.sex]
            message.birthdate = data[data.componentIds.birthdate]
        } else {
            message.address.province = capitalizeFirstLetter(data[data.componentIds.province])
            message.address.address = capitalizeFirstLetter(data[data.componentIds.address])
        }
        Api.register(
            message, 
            () => this.props.onError("Qualcosa nella registrazione non ha funzionato correttamente, riprova."),
            () => {
                Api.login(message.email, message.password,
                    () => {
                        this.props.onError("La registrazione è stata effettuata correttamente, effettua il login.")
                        this.state.redirectComponent.redirectToLogin()
                    },
                    user => {
                        this.props.onLoginSuccessfull(user)
                        this.state.homeRedirect.redirectAfterLogin()
                    })
            }
        )
    }

    render() {
        return (
            <div className={styles.loginContainer}>
                <main className="main-container d-flex align-items-center">
                    <div className={"container-fluid col-11 col-md-6 my-3 " + styles.bgText}>
                        <div className="form-group row">
                            <div className="col text-center">
                                <h3>EventHub</h3>
                            </div>
                        </div>
                        <RegistrationTab tabs={[
                            Object.freeze({
                                tag: "Utente privato", 
                                elem: <RegistrationForm 
                                            privateUser={true} 
                                            onRegistration={this.onRegistration} 
                                            onError={this.props.onError}
                                        />
                            }),
                            Object.freeze({
                                tag: "Organizzazione", 
                                elem: <RegistrationForm 
                                            privateUser={false}
                                            onRegistration={this.onRegistration}
                                            onError={this.props.onError}
                                        />
                            })
                        ]} />
                    </div>
                </main>
                <LoginRedirect
                    {...this.props} 
                    onRef={this.setRedirectToLoginRef}
                />
                <LoginSuccessfullRedirect
                    {...this.props}
                    onRef={this.setRedirectToHomeRef}
                />
            </div>
        )
    }
}

export default Registration;
