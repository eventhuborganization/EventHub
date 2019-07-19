import React from 'react';
import axios from 'axios';
import styles from '../login/Login.module.css';
import RegistrationForm from './RegistrationForm'
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
                        <ul className="nav nav-pills mb-3 d-flex justify-content-center" id="user-selection" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="private-user-tab" data-toggle="pill" href="#private-user" role="tab" aria-controls="private-user" aria-selected="true">
                                    Utente privato
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="organization-tab" data-toggle="pill" href="#organization" role="tab" aria-controls="organization" aria-selected="false">
                                    Organizzazione
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content" id="user-selection-content">
                            <div className="tab-pane fade show active h-100" id="private-user" role="tabpanel" aria-labelledby="private-user-tab">
                                <RegistrationForm privateUser={true} onRegistration={this.onRegistration} onError={this.props.onError}/>
                            </div>
                            <div className="tab-pane fade" id="organization" role="tabpanel" aria-labelledby="organization-tab">
                                <RegistrationForm privateUser={false} onRegistration={this.onRegistration} onError={this.props.onError}/>
                            </div>
                        </div>
                    </div>
                </main>
                <LoginSuccessfullRedirect
                    {...this.props} 
                    onRef={this.redirect}
                />
            </div>
        );
    }
}

/*
function RegistrationTab(props) {
    let count = -1
    let navigationBar = props.tabs.map(element => {
        count++
        return (
            <li className="nav-item">
                <a  className={(count == 0 ? "active " : "") + "nav-link"} 
                    id={count + "-tab"} 
                    data-toggle="pill" 
                    href={"#" + count + "-elem"} 
                    role="tab" aria-controls={count + "-elem"} aria-selected={count == 0 ? true : false}>
                    {element.tag}
                </a>
            </li>
        )
    })
    count = -1
    let tabBar = props.tabs.map(element => {
        count ++
        return (
            <div className={(count == 0 ? "active show " : "") + "tab-pane fade h-100"} 
                 id={count + "-elem"} 
                 role="tabpanel" aria-labelledby={count + "-tab"}>
                {element.elem}
            </div>
        )
    })
    return (
        <div>
            <ul className="nav nav-pills mb-3 d-flex justify-content-center" id="user-selection" role="tablist">
                {navigationBar}
            </ul>
            <div className="tab-content" id="user-selection-content">
                {tabBar}
            </div>
        </div>
    );
}*/

export default Registration;
