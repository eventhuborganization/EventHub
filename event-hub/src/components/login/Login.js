import React from 'react';
import styles from './Login.module.css';
import { Link } from 'react-router-dom'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            width: 0, 
            height: 0,
            email: "",
            password: ""
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    security = require('js-sha512');
      
    componentDidMount = () => {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    emailChanged = (event) => {
        this.setState({email: event.target.value})
    }

    passwordChanged = (event) => {
        this.setState({password: event.target.value})
    }

    submitLogin = (event) => {
        this.setState({password: this.security.sha512(this.state.password)})        
        event.preventDefault();
    }

    render() {
        return (
            <div className={styles.loginContainer} style={{height: this.state.height}}>
                
                <div className={"row " + styles.bgImage}></div>
                
                <main className="row">
                    <form onSubmit={this.submitLogin} className={"col-10 col-md-4 " + styles.bgText}>
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
            </div>
        )
    }
}

export default Login;
