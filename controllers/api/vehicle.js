const express = require("express");
const app = express();
const Op = require("sequelize").Op;


app.get("/list", async (req, res, next) => {
  try {
    var params = req.body;
    var status = [0, 1];
    var where = {};
    if (params.status) status = params.status;

    if (params.search && params.search != "") {
      where = {
        [Op.or]: [
          { name: { [Op.like]: `%${params.search}%` } },
          sequelize.where(
            sequelize.cast(sequelize.col("price"), "char"),

            {
              [Op.like]: `%${params.search}%`,
            }
          ),


          sequelize.where(
            sequelize.cast(sequelize.col("baseFare"), "char"),

            {
              [Op.like]: `%${params.search}%`,
            }
          ),
        ],
      };
    }

    where.status = status;

    var vehicleData = await VEHICLE.findAll({ where: where });
    return responseHelper.post(res, appstrings.success, { data: vehicleData });
  } catch (e) {
    return responseHelper.error(res, e.message, 400);
  }
});
app.post("/add", async (req, res, next) => {
  var data = req.body;
  let responseNull = common.checkParameterMissing([data.name, data.price,data.baseFare]);
  if (responseNull) return responseHelper.post(res, appstrings.required_field, null, 400);
  try {
    var icon = "";
    if (req.files) {
      ImageFile = req.files.icon;
      if (ImageFile) {
        icon = Date.now() + "_" + ImageFile.name.replace(/\s/g, "");

        ImageFile.mv(config.UPLOAD_DIRECTORY + "vehicle/" + icon, function (err) {
          //upload file
          if (err) return responseHelper.error(res, err.meessage, 400);
        });
      }
    }
    var vehicleData = await VEHICLE.findOne({
      where: {
        name: data.name,
       

      },
    });

    if (!vehicleData) {
      var lastData = await VEHICLE.findOne({limit:1,plain:true,order:[['createdAt','DESC']]});
      var id=lastData && lastData.id?Number(lastData.id):0
  //console.log("id",lastData,id,Math.floor(Date.now() /1000))

      var createData = await VEHICLE.create({
        id:(id+1),
        name: data.name,
        price: data.price,
        baseFare: data.baseFare,
        icon: icon,
        createdAt:Math.floor(Date.now() /1000)


      });


      if (createData) return responseHelper.post(res, appstrings.success, createData);
      else return responseHelper.error(res, "Unable to insert!", 402);
    } else return responseHelper.post(res, "Vehicle with this name already exists!", null, 204);
  } catch (e) {
    return responseHelper.error(res, e.message, 400);
  }
});
app.put("/update", async (req, res) => {
  try {
    const data = req.body;

    let responseNull = common.checkParameterMissing([data.vehicleId,data.name, data.price,data.baseFare]);
    if (responseNull) return responseHelper.post(res, appstrings.required_field, null, 400);

    var icon = "";
    if (req.files) {
      ImageFile = req.files.icon;
      if (ImageFile) {
        icon = Date.now() + "_" + ImageFile.name.replace(/\s/g, "");

        ImageFile.mv(config.UPLOAD_DIRECTORY + "vehicle/" + icon, function (err) {
          //upload file
          if (err) return responseHelper.error(res, err.meessage, 400);
        });
      }
    }

    const vehicleData = await VEHICLE.findOne({
      attributes: ["icon"],
      where: {
        id: data.vehicleId,
      },
    });

    if (vehicleData) {
      if (icon == "") icon = vehicleData.dataValues.icon;

      const users = await VEHICLE.update(
        {
          name: data.name,
          price: data.price,
          baseFare: data.baseFare,
          icon: icon,
        },
        {
          where: {
            id: data.vehicleId,
          },
        }
      );
      if (users) {
        responseHelper.post(res, appstrings.success, null, 200);
      } else responseHelper.error(res, appstrings.oops_something, 400);
    } else responseHelper.error(res, appstrings.no_record, 400);
  } catch (e) {
    return responseHelper.error(res, e.message, 400);
  }
});
app.patch("/status", async (req, res, next) => {
  var params = req.body;
  try {
    let responseNull = common.checkParameterMissing([params.id, params.status]);
    if (responseNull) return responseHelper.post(res, appstrings.required_field, null, 400);

    const userData = await VEHICLE.findOne({
      where: {
        id: params.id,
      },
    });

    if (userData) {
     
      const updatedResponse = await VEHICLE.update(
        {
          status: params.status,
        },
        {
          where: {
            id: userData.dataValues.id,
          },
        }
      );

      if (updatedResponse) {
        return responseHelper.post(res, appstrings.success, updatedResponse,200);
      } else {
        return responseHelper.post(res, "Something went Wrong", null, 400);
      }
    } else {
      return responseHelper.post(res, appstrings.no_record, null, 204);
    }
  } catch (e) {
    return responseHelper.error(res, e.message, 400);
  }
});
app.delete('/delete',async(req,res) => {
  const params = req.query;
  
  let responseNull=  common.checkParameterMissing([params.vehicleId])
  if(responseNull) return responseHelper.error(res, appstrings.required_field, 400);

  try{
    const orderData = await VEHICLE.findOne({
    where: {
      id: params.vehicleId,
      
    }
    })  
      
    if(orderData)
   {

const numAffectedRows = await VEHICLE.destroy({
  where: {
    id: params.vehicleId

  }
  })  
    
  if(numAffectedRows>0)
  return responseHelper.post(res, appstrings.success,null);
 
}
else
return responseHelper.post(res, appstrings.no_record,null, 204);
}
catch (e) {
  return responseHelper.error(res, e.message, 400);
}
    
});
module.exports = app;
