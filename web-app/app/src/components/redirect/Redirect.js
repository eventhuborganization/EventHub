import React from 'react'
import {Redirect} from 'react-router-dom'

let routes = require("../../services/routes/Routes")

class CallableComponent extends React.Component {
    componentDidMount() {
        if (this.props.onRef)
            this.props.onRef(this)
    }
    componentWillUnmount() {
        if (this.props.onRef)
            this.props.onRef(undefined)
    }
    render() {
        return (<div />)
    }
}

class RedirectComponent extends CallableComponent {
    constructor(props) {
        super(props)
        this.state = {
            redirect: !!props.redirectNow
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        this.setRedirect(false)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.redirectNow !== this.props.redirectNow)
            this.state.redirect = !!this.props.redirectNow
    }

    renderRedirect() {
        if (this.state.redirect)
            return <Redirect from={this.props.from} to={this.props.to} />
    }

    setRedirect(value) {
        this.setState({redirect: value})
    }

    render() {
        return (<div>{this.renderRedirect()}</div>)
    }
}

class LoginRedirect extends CallableComponent {

    constructor(props) {
        super(props)
        this.state = {
            redirectComponent: undefined
        }
    }

    doIfLoggedOrElseRedirect(toDo) {
        if (this.props.isLogged)
            toDo()
        else
            this.redirectToLogin()
    }

    redirectToLogin() {
        if (this.state.redirectComponent)
            this.state.redirectComponent.setRedirect(true)
    }

    saveRedirectComponentRef(ref) {
        this.setState({redirectComponent: ref})
        if (this.props.onRef)
            this.props.onRef(this)
    }

    render() {
        let from = this.props.location && this.props.location.pathname
            ? this.props.location.pathname : routes.home
        return (
            <div>
                <RedirectComponent {...this.props}
                                   from={from}
                                   to={routes.login}
                                   redirectNow={this.props.redirectIfNotLogged && !this.props.isLogged}
                                   onRef={ref => this.saveRedirectComponentRef(ref)}/>
            </div>
        )
    }
}

class LoginSuccessfullRedirect extends CallableComponent {

    constructor(props) {
        super(props)
        this.state = {
            redirectComponent: undefined
        }
    }

    redirectAfterLogin() {
        if (this.state.redirectComponent)
            this.state.redirectComponent.setRedirect(true)
    }

    saveRedirectComponentRef(ref) {
        this.setState({redirectComponent: ref})
        if (this.props.onRef)
            this.props.onRef(this)
    }

    render() {
        return (
            <div>
                <RedirectComponent {...this.props}
                                   to={routes.home}
                                   redirectNow={false}
                                   onRef={ref => this.saveRedirectComponentRef(ref)}/>
            </div>
        )
    }
}

export {CallableComponent, RedirectComponent, LoginRedirect, LoginSuccessfullRedirect}