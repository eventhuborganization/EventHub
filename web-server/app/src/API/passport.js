exports.initialize = (app) => {
    const cookieSession = require('cookie-session')
    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy
    const axios = require('axios')

    app.use(cookieSession({
        name: 'event-hub',
        keys: ['event-hub'],
        maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            (username, password, done) => {
                axios.post(UserServiceServer + "/users/credentials", {
                    email: username, password: password
                })
                    .then(response => {
                        let user = response.data
                        if (user)
                            done(null, user)
                        else
                            done(null, false, { message: 'Incorrect username or password'})
                    })
                    .catch(() => done(null, false, { message: 'Incorrect username or password'}));
            }
        )
    )

    passport.serializeUser((user, done) =>
        done(null, user._id)
    )

    passport.deserializeUser((id, done) => {
        let user = {
            _id: id
        }
        done(null, user)
    })
}

exports.loginChecker = (req, res, next) => {
    if (req.isAuthenticated())
        return next()
    else
        res.status(401).send('You are not authenticated')
}