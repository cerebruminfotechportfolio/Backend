module.exports = {
  development: {
    username: "root",
    password: "",
    database: "test",
    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
      charset: "utf8mb4",
    },
    logging: false,
    connectionLimit: 10,
    connectionTimeout: 100000,
    requestTimeout: 100000,
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      charset: "utf8mb4",
      dialectOptions: {
        collate: "utf8mb4_general_ci",
      },
    },
  },
  
};
