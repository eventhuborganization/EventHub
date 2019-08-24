import React from 'react'
import Api from '../../services/api/Api'
import Resizer from 'react-image-file-resizer'

class ChangeCredentials extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            oldEmail: props.user.email,
            newEmail: props.user.email,
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
        if(name === "confirmPassword"){
            this.passwordConvalidation(value === this.state.newPassword)
        } else if (name === "newPassword") {
            this.passwordConvalidation(value === this.state.confirmPassword)
        } 
        this.setState({
            [name]: value
        })
    }

    security = require('js-sha512')

    passwordConvalidation = (valid) => {
        let pwdClassList = document.getElementById("newPassword").classList
        let confirmClassList = document.getElementById("confirmPassword").classList
        pwdClassList.remove(valid ? "is-invalid" : "is-valid")
        pwdClassList.add(valid ? "is-valid" : "is-invalid")
        confirmClassList.remove(valid ? "is-invalid" : "is-valid")
        confirmClassList.add(valid ? "is-valid" : "is-invalid")
        this.setState({
            pwdCorrect: valid
        })
    }

    onUpdate = (event) => {
        event.preventDefault();
        if(!this.state.pwdCorrect && (this.state.newPassword !== "" || this.state.confirmPassword !== "")){
            this.props.onError("Le password non coincidono!")
        } else if(this.state.oldPassword === this.state.newPassword){
            this.props.onError("La nuova password non può essere uguale alla precedente!")
        } else if (this.state.pwdCorrect && (this.state.newPassword.length === 0 || !this.state.newPassword.trim())){
            this.props.onError("La nuova password non può essere vuota!")
        } else if(this.state.newEmail !== this.state.oldEmail || this.state.newPassword !== "") {
            let message = {
                email: this.state.oldEmail,
                password: this.security.sha512(this.state.oldPassword)
            }
            let user = this.props.user
            if(this.state.newPassword !== ""){
                message.newPassword = this.security.sha512(this.state.newPassword)
            }
            if(this.state.newEmail !== this.state.oldEmail){
                message.newEmail = this.state.newEmail
                user.email = this.state.newEmail
            }
            Api.updateUserCredentials(
                message, 
                () => this.props.onError("Qualcosa nell'aggiornamento non ha funzionato correttamente, riprova"),
                () => {
                    this.setState((prevState) => { return {
                        oldEmail: prevState.newEmail,
                        newEmail: prevState.newEmail,
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                        pwdCorrect: false
                    }})
                    this.props.onChange(user)
                    this.props.onSuccess("I tuoi dati sono stati aggiornati correttamente!")
                    document.getElementById("oldPassword").value = ""
                    let newPwd = document.getElementById("newPassword")
                    let confirmPwd = document.getElementById("confirmPassword")
                    newPwd.value = ""
                    confirmPwd.value = ""
                    newPwd.classList.remove("is-valid")
                    confirmPwd.classList.remove("is-valid")
                }
            )
        }
    }

    render() {
        return (
            <SettingsCard
                onSubmit={this.onUpdate}
                title={"Cambia credenziali"}
                components={[
                    <SettingsComponent
                        key={"comp1"} 
                        label="Email" 
                        componentId={"newEmail"}
                        componentName={"newEmail"}
                        componentType="text"
                        value={this.state.newEmail}
                        mandatory={true}
                        onChangeHandler={this.handleChangeEvent}
                        show={true}
                    />,
                    <SettingsComponent 
                        key={"comp2"}
                        label="Vecchia password" 
                        componentId={"oldPassword"}
                        componentName={"oldPassword"}
                        componentType="password"
                        placeholder=""
                        mandatory={true}
                        onChangeHandler={this.handleChangeEvent}
                        show={true}
                    />,
                    <SettingsComponent 
                        key={"comp3"}
                        label="Nuova password" 
                        componentId={"newPassword"}
                        componentName={"newPassword"}
                        componentType="password"
                        placeholder=""
                        onChangeHandler={this.handleChangeEvent}
                        invalidFeedback={"Le password non coincidono"}
                        show={true}
                    />,
                    <SettingsComponent
                        key={"comp4"}
                        label="Conferma password" 
                        componentId={"confirmPassword"}
                        componentName={"confirmPassword"}
                        componentType="password"
                        placeholder=""
                        onChangeHandler={this.handleChangeEvent}
                        invalidFeedback={"Le password non coincidono"}
                        show={true}
                    />
                ]}
            />
        )
    }
}

class ChangeInfo extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            name: [false, this.props.user.name],
            surname: [false, this.props.user.surname],
            city: [false, this.props.user.address ? this.props.user.address.city : ""],
            province: [false, this.props.user.address ? this.props.user.address.province : ""],
            address: [false, this.props.user.address ? this.props.user.address.address : ""],
            phone: [false, this.props.user.phone],
            avatar: [false, (this.props.user.avatar ? this.props.user.avatar : "")]
        }
    }

    handleChangeEvent = (event) => {
        let target = event.target
        let name = target.name
        let value = target.value
        if (name === "avatar" && event.target.files.length > 0){
            Resizer.imageFileResizer(
                event.target.files[0],
                200,
                200,
                'JPEG',
                100,
                0,
                uri => {
                    this.setState({[name]: [true, uri]})
                },
                'base64'
            )
        } else {
            this.setState({
                [name]: [true, value]
            })
        }
    }

    somethingHasChanged = () => {
        return this.state.name[0] || this.state.surname[0] || this.state.city[0]
                || this.state.province[0] || this.state.address[0] || this.state.phone[0]
                || this.state.avatar[0]
    }

    onUpdate = (event) => {
        event.preventDefault();
        if(this.somethingHasChanged()){
            let message = {}
            let user = this.props.user
            if(this.state.name[0]){
                message.name = this.state.name[1]
                user.name = this.state.name[1]
            }
            if(this.state.surname[0] && !this.props.user.organization){
                message.surname = this.state.surname[1]
                user.surname = this.state.surname[1]
            }
            if(this.state.city[0]){
                message.address.city = this.state.city[1]
                user.address.city = this.state.city[1]
            }
            if(this.state.province[0] && this.props.user.organization){
                message.address.province = this.state.province[1]
                user.address.province = this.state.province[1]
            }
            if(this.state.address[0] && this.props.user.organization){
                message.address.address = this.state.address[1]
                user.address.address = this.state.address[1]
            }
            if(this.state.phone[0]){
                message.phone = this.state.phone[1]
                user.phone = this.state.phone[1]
            }
            if(this.state.avatar[0]){
                message.avatar = this.state.avatar[1]
                user.avatar = this.state.avatar[1]
            }
            if (this.state.name[1] 
                && this.state.surname[1] 
                && this.state.city[1] 
                && (this.state.province[1] || !this.props.user.organization)
                && (this.state.address[1] || !this.props.user.organization)) {
                Api.updateUserProfile(
                    message, 
                    () => this.props.onError("Qualcosa nell'aggiornamento non ha funzionato correttamente, riprova"),
                    () => {
                        this.props.onChange(user)
                        this.props.onSuccess("I tuoi dati sono stati aggiornati correttamente!")
                    }
                )
            } else {
                this.props.onError("Uno o più campi obbligatori sono vuoti, ricompila e riprova")
            }
            
        }
    }

    render() {
        return (
            <SettingsCard
                onSubmit={this.onUpdate}
                title={"Cambia dati personali"}
                components={[
                    <SettingsComponent
                        key={"comp1"} 
                        label="Nome" 
                        componentId={"name"}
                        componentName={"name"}
                        componentType="text"
                        value={this.state.name[1]}
                        mandatory={false}
                        onChangeHandler={this.handleChangeEvent}
                        show={true}
                    />,
                    <SettingsComponent 
                        key={"comp2"}
                        label="Cognome" 
                        componentId={"surname"}
                        componentName={"surname"}
                        componentType="text"
                        value={this.state.surname[1]}
                        mandatory={false}
                        onChangeHandler={this.handleChangeEvent}
                        show={!this.props.user.organization}
                    />,
                    <SettingsComponent
                        key={"comp3"} 
                        label="Città" 
                        componentId={"city"}
                        componentName={"city"}
                        componentType="text"
                        value={this.state.city[1]}
                        mandatory={false}
                        onChangeHandler={this.handleChangeEvent}
                        show={true}
                    />,
                    <SettingsComponent
                        key={"comp4"}  
                        label="Provincia" 
                        componentId={"province"}
                        componentName={"province"}
                        componentType="text"
                        value={this.state.province[1]}
                        mandatory={false}
                        onChangeHandler={this.handleChangeEvent}
                        show={this.props.user.organization}
                    />,
                    <SettingsComponent
                        key={"comp5"}  
                        label="Indirizzo" 
                        componentId={"address"}
                        componentName={"address"}
                        componentType="text"
                        value={this.state.address[1]}
                        mandatory={false}
                        onChangeHandler={this.handleChangeEvent}
                        show={this.props.user.organization}
                    />,
                    <SettingsComponent
                        key={"comp6"}  
                        label="Numero di telefono" 
                        componentId={"phone"}
                        componentName={"phone"}
                        componentType="tel"
                        value={this.state.phone[1]}
                        mandatory={false}
                        onChangeHandler={this.handleChangeEvent}
                        show={true}
                    />,
                    <SettingsFileComponent
                        key={"comp7"} 
                        label="Immagine di profilo"  
                        componentId={"avatar"}
                        componentName={"avatar"}
                        onChangeHandler={this.handleChangeEvent}
                        image={this.state.avatar[1]}
                        mandatory={false}
                        show={true}
                    />
                ]} 
            />
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
                    required={props.mandatory}
                /> 
                <div className="invalid-feedback text-left">
                    {props.invalidFeedback}
                </div>
            </div>
        </div>
    ) : "";
}

function SettingsFileComponent(props) {
    let common = "col-10 col-md-8 mx-auto px-0 "
    let labelClass = common + "text-left"
    let labelInputClass = common + "mx-auto"
    return props.show ? (
        <div>
            <div className="form-group row">
                <label htmlFor={props.componentId} className={labelClass}>
                    {props.label} <span className={(props.mandatory ? "" : "d-none ") + "text-danger"}>*</span>
                </label>
                <div className={labelInputClass}>
                    <input 
                        type="file"
                        accept="image/*" 
                        id={props.componentId} 
                        className="form-control-file" 
                        name={props.componentName}
                        onChange={props.onChangeHandler} 
                        required={props.mandatory}
                    />
                </div>
            </div>
            <div className={props.image ? "form-group row" : "d-none"}>
                <img src={props.image} className={"img-fluid mx-auto d-block"} alt="immagine profilo"/>
            </div>
        </div>
    ) : "";
}

function SettingsCard(props){
    return (
        <form className="mt-3 row" onSubmit={props.onSubmit}>
            <div className="card border-primary shadow mx-auto col-11">
                <div className="card-body">
                    <h5 className="card-title">{props.title}</h5>
                    {props.components}
                    <div className="row">
                        <div className="col d-flex justify-content-center">
                            <input type="reset" value="Cancella" className="btn btn-outline-primary mr-3"/>
                            <input type="submit" value="Aggiorna" className="btn btn-primary mr-3"/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export {ChangeCredentials, ChangeInfo}