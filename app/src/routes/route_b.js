module.exports = (app) => {
    var controller = require("../controllers/controller_b.js");
    app.route("/login")
        .get(controller.getLogin) //ritronare la pagina di login
        .post(controller.login)
        
    app.route("/logout")
        .get(sessionChecker, controller.logout)
}