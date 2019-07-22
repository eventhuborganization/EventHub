import React from 'react';
import myStyles from './Registration.module.css';

let common = "col-10 col-md-8 mx-auto px-0 "
let labelClass = common + "text-left"
let labelInputClass = common + "mx-auto"

class RegistrationForm extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            componentIds: {
                name: "name",
                surname: "surname",
                sex: "sex",
                birthdate: "birthdate",
                city: "city",
                province: "province",
                address: "address",
                phone: "tel",
                email: "email",
                password: "pwd",
                confirmPassword: "pwd-conf"
            },
            sex: "male"
        }
    }

    getShownOrPrivateClass = (classLabel) => {
        return (this.props.privateUser ? "" : "d-none ") + classLabel
    }

    getShownOrOrganizationClass = (classLabel) => {
        return (this.props.privateUser ? "d-none " : "") + classLabel
    }

    getIdBasedOnType = (id) => {
        return id + (this.props.privateUser ? "-private" : "-organizator")
    }

    getNameFromComponentId = (id) => {
        let index = id.lastIndexOf(this.props.privateUser ? "-private" : "-organizator")
        return id.slice(0, index)
    }

    /*
     * if it's a private user it can't insert address,city,province
     * otherwise if it's an organization it can't insert surname,sex,birthdate
     */ 
    isFieldAllowed = (name) => {
        return (this.props.privateUser && (
                    name !== this.state.componentIds.address && 
                    name !== this.state.componentIds.city &&
                    name !== this.state.componentIds.province
                )) || 
                (!this.props.privateUser && (
                    name !== this.state.componentIds.surname &&
                    name !== this.state.componentIds.birthdate &&
                    name !== this.state.componentIds.sex
                )) 
    }

    passwordConvalidation = (target, valid) => {
        target.classList.remove(valid ? "is-invalid" : "is-valid")
        target.classList.add(valid ? "is-valid" : "is-invalid")
        let classList = document.getElementById(this.getIdBasedOnType(this.state.componentIds.password)).classList
        classList.remove(valid ? "is-invalid" : "is-valid")
        classList.add(valid ? "is-valid" : "is-invalid")
        this.setState({
            pwdCorrect: valid
        })
    }

    handleChangeEvent = (event) => {
        let target = event.target
        let name = this.getNameFromComponentId(target.name)
        if(this.isFieldAllowed(name)){
            let value = target.value
            if(name === this.state.componentIds.confirmPassword && value !== this.state.pwd){
                this.passwordConvalidation(target, false)
            } else if (name === this.state.componentIds.confirmPassword && value === this.state.pwd) {
                this.passwordConvalidation(target, true)
            } else {
                this.setState({
                    [name]: value
                })
            }
        }
    }

    onRegistration = (event) => {
        event.preventDefault();
        if(!this.state.pwdCorrect){
            this.props.onError("Le password non coincidono!");
        } else {
            this.props.onRegistration(this.state, this.props.privateUser)
        }
    }

    render = () => {
        return (
            <form onSubmit={this.onRegistration}>
                <RegistrationComponent
                    label="Nome" 
                    componentId={this.getIdBasedOnType(this.state.componentIds.name)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.name)}
                    componentType="text"
                    placeholder="Mario"
                    onChangeHandler={this.handleChangeEvent}
                    mandatory={true}
                    show={true}
                />
                <RegistrationComponent
                    label="Cognome"  
                    componentId={this.getIdBasedOnType(this.state.componentIds.surname)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.surname)}
                    componentType="text"
                    placeholder="Rossi"
                    onChangeHandler={this.handleChangeEvent}
                    mandatory={true}
                    show={this.props.privateUser}
                />
                <RegistrationRadioComponent
                    label="Sesso"
                    labelA="Maschio"
                    labelB="Femmina"
                    valueA="male"
                    valueB="female"   
                    componentIdA={this.getIdBasedOnType("radioMale")}
                    componentIdB={this.getIdBasedOnType("radioFemale")}
                    componentName={this.getIdBasedOnType(this.state.componentIds.sex)}
                    onChangeHandler={this.handleChangeEvent}
                    mandatory={true}
                    show={this.props.privateUser}
                />
                <RegistrationComponent
                    label="Data di nascita"  
                    componentId={this.getIdBasedOnType(this.state.componentIds.birthdate)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.birthdate)}
                    componentType="date"
                    onChangeHandler={this.handleChangeEvent}
                    mandatory={true}
                    show={this.props.privateUser}
                />
                <RegistrationComponent
                    label="Città"  
                    componentId={this.getIdBasedOnType(this.state.componentIds.city)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.city)}
                    componentType="text"
                    placeholder="Imola"
                    onChangeHandler={this.handleChangeEvent}
                    mandatory={true}
                    show={!this.props.privateUser}
                />
                <RegistrationComponent
                    label="Provincia"  
                    componentId={this.getIdBasedOnType(this.state.componentIds.province)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.province)}
                    componentType="text"
                    placeholder="Bologna"
                    onChangeHandler={this.handleChangeEvent}
                    mandatory={true}
                    show={!this.props.privateUser}
                />
                <RegistrationComponent
                    label="Indirizzo"  
                    componentId={this.getIdBasedOnType(this.state.componentIds.address)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.address)}
                    componentType="text"
                    placeholder="Via Tal dei Tali, 15"
                    onChangeHandler={this.handleChangeEvent}
                    mandatory={true}
                    show={!this.props.privateUser}
                />
                <RegistrationComponent
                    label="Numero di telefono"  
                    componentId={this.getIdBasedOnType(this.state.componentIds.phone)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.phone)}
                    componentType="tel"
                    placeholder="333 4444444"
                    onChangeHandler={this.handleChangeEvent}
                    mandatory={!this.props.privateUser}
                    show={true}
                />
                <RegistrationComponent
                    label="Email"  
                    componentId={this.getIdBasedOnType(this.state.componentIds.email)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.email)}
                    componentType="email"
                    placeholder="prova@mail.com"
                    onChangeHandler={this.handleChangeEvent}
                    mandatory={true}
                    show={true}
                />
                <RegistrationComponent
                    label="Password"  
                    componentId={this.getIdBasedOnType(this.state.componentIds.password)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.password)}
                    componentType="password"
                    invalidFeedback={"Le password non coincidono"}
                    onChangeHandler={this.handleChangeEvent}
                    mandatory={true}
                    show={true}
                />
                <RegistrationComponent
                    label="Conferma password"  
                    componentId={this.getIdBasedOnType(this.state.componentIds.confirmPassword)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.confirmPassword)}
                    componentType="password"
                    onChangeHandler={this.handleChangeEvent}
                    invalidFeedback={"Le password non coincidono"}
                    mandatory={true}
                    show={true}
                />
                <div className="row">
                    <div className="col d-flex justify-content-start">
                        <label className="p-0 text-danger">*obbligatorio</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-end">
                        <input type="reset" value="Cancella" className="btn btn-outline-light mr-3"/>
                        <input type="submit" value="Registrati" className="btn btn-light mr-3"/>
                    </div>
                </div>
            </form>
        );
    }

}

function RegistrationComponent(props) {
    return props.show ? (
        <div className="form-group">
            <label htmlFor={props.componentId} className={labelClass}>
                {props.label} <span className={(props.mandatory ? "" : "d-none ") + "text-danger"}>*</span>
            </label>
            <div className={labelInputClass}>
                <input 
                    type={props.componentType} 
                    id={props.componentId} 
                    className="form-control" 
                    name={props.componentName} 
                    placeholder={props.placeholder ? props.placeholder : null}
                    onChange={props.onChangeHandler} 
                    required={props.mandatory}
                /> 
                <div className="invalid-feedback text-left">
                    {props.invalidFeedback}
                </div>
            </div>
        </div>
    ) : "";
}

function RegistrationRadioComponent(props){
    return props.show ? (
        <div className="form-group">
            <label className={labelClass}>
                {props.label} <span className={(props.mandatory ? "" : "d-none ") + "text-danger"}>*</span>
            </label>
            <div className={"col-10 col-md-8 mx-auto " + myStyles.toggle}>
                <input type="radio" value={props.valueA} defaultChecked
                    name={props.componentName} 
                    id={props.componentIdA} 
                    onChange={props.onChangeHandler}
                />
                <label htmlFor={props.componentIdA}>{props.labelA}</label>
                <input type="radio" value={props.valueB}
                    name={props.componentName} 
                    id={props.componentIdB} 
                    onChange={props.onChangeHandler} 
                />
                <label htmlFor={props.componentIdB}>{props.labelB}</label>
            </div>
        </div>
    ) : "";
}

export default RegistrationForm