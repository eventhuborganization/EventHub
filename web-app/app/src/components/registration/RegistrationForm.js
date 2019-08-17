import React from 'react'
import myStyles from './Registration.module.css'
import Resizer from 'react-image-file-resizer'

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
                avatar: "avatar",
                email: "email",
                password: "pwd",
                confirmPassword: "pwd-conf"
            }
        }
        this.state[this.state.componentIds.name] = ""
        this.state[this.state.componentIds.surname] = ""
        this.state[this.state.componentIds.sex] = "Male"
        this.state[this.state.componentIds.birthdate] = ""
        this.state[this.state.componentIds.city] = ""
        this.state[this.state.componentIds.province] = ""
        this.state[this.state.componentIds.address] = ""
        this.state[this.state.componentIds.phone] = ""
        this.state[this.state.componentIds.avatar] = undefined
        this.state[this.state.componentIds.email] = ""
        this.state[this.state.componentIds.password] = ""
        this.state[this.state.componentIds.confirmPassword] = ""
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
     * if it's a private user it can't insert address,province
     * otherwise if it's an organization it can't insert surname,sex,birthdate
     */ 
    isFieldAllowed = (name) => {
        return (this.props.privateUser && (
                    name !== this.state.componentIds.address &&
                    name !== this.state.componentIds.province
                )) || 
                (!this.props.privateUser && (
                    name !== this.state.componentIds.surname &&
                    name !== this.state.componentIds.birthdate &&
                    name !== this.state.componentIds.sex
                )) 
    }

    passwordConvalidation = (valid) => {
        let pwdClassList = document.getElementById(this.getIdBasedOnType(this.state.componentIds.password)).classList
        let confirmClassList = document.getElementById(this.getIdBasedOnType(this.state.componentIds.confirmPassword)).classList
        pwdClassList.remove(valid ? "is-invalid" : "is-valid")
        pwdClassList.add(valid ? "is-valid" : "is-invalid")
        confirmClassList.remove(valid ? "is-invalid" : "is-valid")
        confirmClassList.add(valid ? "is-valid" : "is-invalid")
        this.setState({
            pwdCorrect: valid
        })
    }

    handleChangeEvent = (event) => {
        let target = event.target
        let name = this.getNameFromComponentId(target.name)
        if(this.isFieldAllowed(name)){
            let value = target.value
            if(name === this.state.componentIds.confirmPassword){
                this.passwordConvalidation(value === this.state[this.state.componentIds.password])
                this.setState({
                    [name]: value
                })
            } else if (name === this.state.componentIds.password) {
                this.passwordConvalidation(value === this.state[this.state.componentIds.confirmPassword])
                this.setState({
                    [name]: value
                })
            } else if (name === this.state.componentIds.avatar) {
                /*let reader = new FileReader()
                reader.onload = e => {
                    let img = new Image()
                    img.src = e.target.result
                    img.onload = () => {
                        let elem = document.createElement("canvas")
                        let width = 300
                        let scaleFactor = width / img.width;
                        elem.width = width;
                        elem.height = img.height * scaleFactor;
                        let ctx = elem.getContext("2d")
                        ctx.drawImage(img, 0, 0, width, img.height * scaleFactor)
                        const data = ctx.canvas.toDataURL(img, "image/jpeg", 0.6)
                        console.log(data);
                        
                        this.setState({[name]: data})
                    }
                }
                if(event.target.files.length > 0){
                    reader.readAsDataURL(event.target.files[0])
                }*/
                if(event.target.files.length > 0){
                    Resizer.imageFileResizer(
                        event.target.files[0],
                        200,
                        200,
                        'JPEG',
                        100,
                        0,
                        uri => {
                            this.setState({[name]: uri})
                        },
                        'base64'
                    )
                }
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
                    show={true}
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
                <RegistrationFileComponent
                    label="Immagine di profilo"  
                    componentId={this.getIdBasedOnType(this.state.componentIds.avatar)}
                    componentName={this.getIdBasedOnType(this.state.componentIds.avatar)}
                    onChangeHandler={this.handleChangeEvent}
                    image={this.state[this.state.componentIds.avatar]}
                    mandatory={false}
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

function RegistrationFileComponent(props) {
    return props.show ? (
        <div>
            <div className="form-group">
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
            <div className={props.image ? "form-group" : "d-none"}>
                <img src={props.image} alt="immagine profilo" className={"img-fluid"}/>
            </div>
        </div>
    ) : "";
}

export default RegistrationForm