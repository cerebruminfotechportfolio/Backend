const Sequelize = require("sequelize");
const config = require("../config/db").development;

const db = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: config.pool,
});

db.connectionManager.disconnect = (connection) => ({
  tap: (method) => connection.end().then(method),
});

let modules = [require("./models/vehicle")];

// Initialize models
modules.forEach((module) => {
  const model = module(db, Sequelize, config);
  model.sync(true);
  // model.sync(true);
  modules[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.models = modules;

module.exports = db;
