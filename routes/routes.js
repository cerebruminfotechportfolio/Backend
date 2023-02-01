const routes = require("express").Router();
sequelize = require("sequelize");
appstrings = require("./../language/strings.json")["en"];

responseHelper = require("../helpers/responseHelper");
//ALL MODELS

const vehicleCtrl = require("../controllers/api/vehicle");

VEHICLE = db.models.vehicle;


routes.use("/vehicle", vehicleCtrl);

//If No URL found
routes.use((req, res) => {
  return responseHelper.error(res, "Please again check the url,this path is not specified2", 404);
});

module.exports = routes;
