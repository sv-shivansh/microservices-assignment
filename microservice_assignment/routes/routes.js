const controller = require("../controllers/controller");
let baseURL = "/api/v1";

module.exports = (app) => {
    app.route(`${baseURL}/about`).get(controller.about);
    app.route(`${baseURL}/books`).get(controller.fetchAll);
    app.route(`${baseURL}/books`).post(controller.create);

    // app.route("/distance/:zipcode1/:zipcode2").get(controller.getDistance);
};
