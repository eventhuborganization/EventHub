import React from 'react'
import Api from '../../services/api/Api'

class ChangeCredentials extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            oldEmail: props.oldEmail,
            newEmail: props.oldEmail,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            pwdCorrect: false
        }
    }

    handleChangeEvent = (event) => {
        let target = event.target
        let name = target.name
        let value = target.value
        if(name === "confirmPassword" && value !== this.state.newPassword){
            this.passwordConvalidation(target, false)
        } else if (name === "confirmPassword" && value === this.state.newPassword) {
            this.passwordConvalidation(target, true)
        } else {
            this.setState({
                [name]: value
            })
        }
    }

    passwordConvalidation = (target, valid) => {
        target.classList.remove(valid ? "is-invalid" : "is-valid")
        target.classList.add(valid ? "is-valid" : "is-invalid")
        let classList = document.getElementById("newPassword").classList
        classList.remove(valid ? "is-invalid" : "is-valid")
        classList.add(valid ? "is-valid" : "is-invalid")
        this.setState({
            pwdCorrect: valid
        })
    }

    onUpdate = (event) => {
        event.preventDefault();
        if(!this.state.pwdCorrect){
            this.props.onError("Le password non coincidono!")
        } else if(this.state.oldPassword === this.state.newPassword){
            this.props.onError("La nuova password non può essere uguale alla precedente!")
        } else if(this.state.newEmail !== this.state.oldEmail || this.state.newPassword !== "") {
            let message = {
                email: this.state.oldEmail,
                password: this.security.sha512(this.state.oldPassword)
            }
            if(this.state.newPassword !== ""){
                message.newPassword = this.security.sha512(this.state.newPassword)
            }
            if(this.state.newEmail !== this.state.oldEmail){
                message.newEmail = this.state.newEmail
            }
            Api.updateUserCredentials(
                message, 
                () => this.props.onError("Qualcosa nell'aggiornamento non ha funzionato correttamente, riprova"),
                () => {}
            )
        }
    }

    render() {
        return (
            <form className="mt-3 row" onSubmit={this.onUpdate}>
                <div className="card border-primary shadow mx-auto col-11">
                    <div className="card-body">
                        <h5 className="card-title">Cambia credenziali</h5>
                        <SettingsComponent 
                            label="Email" 
                            componentId={"newEmail"}
                            componentName={"newEmail"}
                            componentType="text"
                            value={this.state.newEmail}
                            onChangeHandler={this.handleChangeEvent}
                            show={true}
                        />
                        <SettingsComponent 
                            label="Vecchia password" 
                            componentId={"oldPassword"}
                            componentName={"oldPassword"}
                            componentType="password"
                            placeholder=""
                            onChangeHandler={this.handleChangeEvent}
                            show={true}
                        />
                        <SettingsComponent 
                            label="Nuova password" 
                            componentId={"newPassword"}
                            componentName={"newPassword"}
                            componentType="password"
                            placeholder=""
                            onChangeHandler={this.handleChangeEvent}
                            invalidFeedback={"Le password non coincidono"}
                            show={true}
                        />
                        <SettingsComponent 
                            label="Conferma password" 
                            componentId={"confirmPassword"}
                            componentName={"confirmPassword"}
                            componentType="password"
                            placeholder=""
                            onChangeHandler={this.handleChangeEvent}
                            invalidFeedback={"Le password non coincidono"}
                            show={true}
                        />
                        <div className="row">
                            <div className="col d-flex justify-content-end">
                                <input type="reset" value="Cancella" className="btn btn-outline-primary mr-3"/>
                                <input type="submit" value="Aggiorna" className="btn btn-primary mr-3"/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

function SettingsComponent(props) {
    let common = "col-10 col-md-8 mx-auto px-0 "
    let labelClass = common + "text-left"
    let labelInputClass = common + "mx-auto"
    return props.show ? (
        <div className="form-group row">
            <label htmlFor={props.componentId} className={labelClass}>
                {props.label}
            </label>
            <div className={labelInputClass}>
                <input 
                    type={props.componentType} 
                    id={props.componentId} 
                    className="form-control" 
                    name={props.componentName} 
                    placeholder={props.placeholder ? props.placeholder : null}
                    onChange={props.onChangeHandler}
                    value={props.value}
                /> 
                <div className="invalid-feedback text-left">
                    {props.invalidFeedback}
                </div>
            </div>
        </div>
    ) : "";
}

export {ChangeCredentials}