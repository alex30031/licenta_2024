import { Sequelize} from "sequelize";

export const database = new Sequelize({
  dialect: "sqlite",
  storage: "storage.sqlite",
  pool: {
    max: 5, // Adjust the maximum number of connections
    min: 0, // Adjust the minimum number of connections
    acquire: 30000,
    idle: 10000,
  },
  transactionType: "IMMEDIATE",
});



export const syncDatabase = async () => {
  await database.authenticate();
  await database.sync();
};