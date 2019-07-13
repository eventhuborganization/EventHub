module.exports = (app) => {
    var controller = require("../controllers/controller_b.js");
    app.route("/login")
        .get() //ritronare la pagina di login
        .post(controller.login)
        
    app.route("/logout")
        .post(controller.logout)
}