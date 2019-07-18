import React from 'react';
import axios from 'axios';
import styles from './Login.module.css';
import { Link, Redirect } from 'react-router-dom'

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
        if(!this.state.email.includes("@")){
            this.props.onError("Inserisci una mail valida");
        } else {
            let hashedPwd = this.security.sha512(this.state.password);
            let message = {
                email: this.state.email,
                password: hashedPwd 
            };
            axios.post(this.props.mainServer + "/login", message)
                .then(response => {
                    let status = response.status
                    if (status === 200) {
                        this.props.onLoginSuccessfull(response.data._id);
                        this.renderRedirect();
                    } else if(status === 404) {
                        this.props.onError("Credenziali inserite non corrette");
                    }
                });
        }
        event.preventDefault();
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            this.setState({redirect: true})
            return <Redirect from='/' to='/profile' />
        }
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
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-around">
                            <Link to="/register" className={"btn btn-outline-light " + styles.btn}>Registrati</Link>
                            <input type="submit" value="Login" className={"btn btn-light ml-3 " + styles.btn}/>
                        </div>
                    </form>
                </main>

                {this.renderRedirect()}
            </div>
        )
    }
}

export default Login;
