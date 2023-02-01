const jwt = require("jsonwebtoken");

var functions = {
  userAuth: function (req, res, next) {
    if (req.headers.authorization && req.headers.authorization !== "") {
      var bearerHeader = req.headers.authorization;
      if (typeof bearerHeader !== "undefined") {
        var bearer = bearerHeader.split(" ");
        if (bearer.length > 1) {
          bearerHeader = bearer[1];
        }
      }
      var authorization = bearerHeader;

      jwt.verify(authorization, config.jwtToken, async function (err, decoded) {
        if (decoded) {
          req.id = decoded.id;
          req.phoneNumber = decoded.phoneNumber;

          req.countryCode = decoded.countryCode;
          req.parentCompany = decoded.parentCompany;
          req.token = authorization;
          if (req.headers.companyid && req.headers.companyid != "")
            req.companyId = req.headers.companyid;
          else req.companyId = "";
          //else  return responseHelper.error(res, appstrings.company_mising);

          req.userType = decoded.userType;
          req.myCompanyId = decoded.myCompanyId;
          var userData = null;

          //Get Secret Key

          var keyData = await PAYMENTSETUP.findOne({ where: { companyId: decoded.parentCompany } });
          var key =
            keyData &&
            keyData.dataValues &&
            keyData.dataValues.secretKey != "" &&
            keyData.dataValues.publishedKey != ""
              ? keyData.dataValues.secretKey
              : config.SECRETKEY;
          req.secretKey = key;

          if (req.userType == 1) {
            userData = await USER.findOne({
              where: {
                id: decoded.id,
                status: 1,
              },
            });
          } else {
            userData = await EMPLOYEE.findOne({
              where: {
                id: decoded.id,
                status: [1, 2],
              },
            });
          }
          if (userData) {
            req.userData = userData.dataValues;
            next();
          } else return responseHelper.unauthorized(res, appstrings.blocked);
        } else {
          return responseHelper.unauthorized(res, appstrings.invalid_token);

          // return res.json(401,jsonResponses.response(3, appstrings.invalid_token, null));
        }
      });
    } else {
      return responseHelper.unauthorized(res, appstrings.invalid_token);

      //return res.json(401,jsonResponses.response(3, appstrings.invalid_token, null));
    }
  },
};

module.exports = self = functions;
