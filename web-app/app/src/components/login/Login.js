import React from 'react'
import styles from './Login.module.css'
import Api from '../../services/api/Api'
import { LoginSuccessfullRedirect } from '../redirect/Redirect'
import { Link } from 'react-router-dom'

let routes = require("../../services/routes/Routes")

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            width: 0, 
            height: 0,
            email: "",
            password: "",
            redirect: false
        };
    }

    security = require('js-sha512');
      
    componentDidMount = () => {
        document.getElementById("root").classList.add("p-0", "h-100")
        document.body.classList.add("h-100")
        document.getElementsByTagName("html")[0].classList.add("h-100")
    }
    
    componentWillUnmount = () => {
        this.setState({email: "", password: "", redirect: false});
        document.getElementById("root").classList.remove("p-0", "h-100")
        document.body.classList.remove("h-100")
        document.getElementsByTagName("html")[0].classList.remove("h-100")
    }

    emailChanged = (event) => {
        this.setState({email: event.target.value})
    }

    passwordChanged = (event) => {
        this.setState({password: event.target.value})
    }

    submitLogin = (event) => {
        event.preventDefault()
        if(!this.state.email.includes("@")){
            this.props.onError("Inserisci una mail valida");
        } else {
            let hashedPwd = this.security.sha512(this.state.password);
            Api.login(
                this.state.email, 
                hashedPwd,
                () => this.props.onError("Credenziali inserite non corrette"),
                user => {
                    this.props.onLoginSuccessfull(user)
                    this.state.loginRedirect.redirectAfterLogin()
                }
            )
        }
    }

    redirect = (redirectComponent) => {
        this.setState({
            loginRedirect: redirectComponent
        })
    }

    render() {
        return (
            <div className={styles.loginContainer}>
                
                <main className={"d-flex align-items-center " + styles.bgImage}>
                    <form onSubmit={this.submitLogin} className={"col-10 col-md-4 mx-auto " + styles.bgText}>
                        <div className="form-group row">
                            <div className="col text-center">
                                <h3>EventHub</h3>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="email" className="col-4 col-md-2 col-form-label">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                className="form-control col-7 col-md-9 ml-md-3" 
                                name="email" 
                                placeholder="prova@mail.com"
                                onChange={this.emailChanged}
                                value={this.state.email} 
                                required
                            />
                        </div>
                        <div className="form-group row">
                            <label htmlFor="pwd" className="col-4 col-md-2 col-form-label">Password</label>
                            <input 
                                type="password" 
                                id="pwd" 
                                className="form-control col-7 col-md-9 ml-md-3" 
                                name="pwd" 
                                placeholder="Password" 
                                onChange={this.passwordChanged}
                                value={this.state.password} 
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-around">
                            <Link to={routes.registration} className={"btn btn-outline-light " + styles.btn}>Registrati</Link>
                            <input type="submit" value="Login" className={"btn btn-light ml-3 " + styles.btn}/>
                        </div>
                    </form>
                </main>

                <LoginSuccessfullRedirect
                    {...this.props} 
                    onRef={this.redirect}
                />
            </div>
        )
    }
}

export default Login;
