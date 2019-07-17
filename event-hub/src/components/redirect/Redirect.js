import React from 'react'
import {Redirect} from 'react-router-dom'

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
        return (<div></div>)
    }
}

class RedirectComponent extends CallableComponent {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        this.setRedirect(false)
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

    componentDidMount() {}

    doIfLogged(toDo) {
        if (this.props.isLogged)
            toDo()
        else
            this.redirectToLogin()
    }

    redirectIfNotLogged() {
        if (!this.props.isLogged)
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
        return (
            <div>
                <RedirectComponent {...this.props}
                                   from={this.props.location.pathname}
                                   to={"/login"}
                                   onRef={ref => this.saveRedirectComponentRef(ref)}/>
            </div>
        )
    }
}

export {LoginRedirect}