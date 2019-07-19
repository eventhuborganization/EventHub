import React from 'react';
import axios from 'axios';
import styles from '../login/Login.module.css';
import RegistrationForm from './RegistrationForm'
import RegistrationTab from './RegistrationTab'
import {LoginSuccessfullRedirect} from '../redirect/Redirect'


class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectComponent : undefined
        };
    }

    security = require('js-sha512');
  
    componentDidMount = () => {
        document.getElementById("root").classList.add("p-0", styles.bgImage)
    }

    componentWillUnmount = () => {
        document.getElementById("root").classList.remove("p-0", styles.bgImage)
    }

    redirect = (redirectComponent) => {
        this.setState({
            redirectComponent: redirectComponent
        })
    }

    onRegistration = (data, privateUser) => {
        let hashedPwd = this.security.sha512(data[data.componentIds.password]);
        let message = {
            name: data[data.componentIds.name],
            email: data[data.componentIds.email],
            organization: !privateUser,
            password: hashedPwd 
        };
        if(data[data.componentIds.phone]){
            message.phone = data[data.componentIds.phone]
        }
        if(privateUser){
            message.surname = data[data.componentIds.surname]
            message.gender = data[data.componentIds.sex]
            message.birthdate = data[data.componentIds.birthdate]
        } else {
            message.address = {
                city: data[data.componentIds.city],
                province: data[data.componentIds.province],
                address: data[data.componentIds.address]
            }
        }
        axios.post(this.props.mainServer + "/registration", message)
            .then(response => {
                let status = response.status
                if (status === 201) {
                    this.props.onRegistration(response.data._id)
                    this.state.redirectComponent.redirectAfterLogin()
                } else {
                    this.props.onError(response.data.description)
                }
            })
            .catch(this.props.onError("Qualcosa nella registrazione non ha funzionato correttamente, riprova"));
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
                <LoginSuccessfullRedirect
                    {...this.props} 
                    onRef={this.redirect}
                />
            </div>
        )
    }
}

export default Registration;
