const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const checkConn = require("./helpers/checkConn");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const middleware = require("./middleware/auth");
checkAuth = middleware.userAuth;
const http = require("http");
config = require("config");

const port = config.PORT || 9066;

common = require("./helpers/common");
db = require("./db/db");
const routes = require("./routes/routes");

const server = http.createServer(app);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
/*
Increase Upload File Size
*/
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(fileUpload({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use("/api", routes);
/*
Serve Static Folder
*/
app.use("/", express.static(path.join(__dirname, "/public")));
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("*", function (req, res) {
  return res.render("admin/partials/norecord.ejs");
});

/*
Check Db connection
*/
const healthCheck = async () => {
  await checkConn.checkDbConnection();
};

/*
Start Server
*/
server.listen(port, async () => {
  await healthCheck();

  console.log(`Listening on port ${port}`);
});

// var autoassignment = require('./controllers/dashboard/autoassign')

//Tedting
