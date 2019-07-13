module.exports = (app) => {
    var routes_b = require('./src/routes/route_b.js');
    
    var controller = require("../controllers/controller_a.js");

    app.route("/")
        .get(controller.getHome);

    app.route("/events/:fromIndex")
        .get(controller.getEvents)

    app.route("/notification/friendship")
        .post(controller.friendshipAnswer);

    app.route("/notification/friendposition")
        .post(controller.getFriendPosition);

    app.route("/registration")
        .post(controller.registration);

    app.route("/profile")
        .put(controller.updateProfile);

    app.route("/profile/credentiels")
        .put(controller.updateCredentials);

    app.route("/user/:uuid")
        .get(controller.getInfoUser);

    app.route("/user/search/:name")
        .get(controller.searchUser);

    routes_b(app);
}