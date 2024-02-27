import { Sequelize } from "sequelize";

export const database = new Sequelize({
  dialect: "sqlite",
  storage: "storage.sqlite",
});

export const syncDatabase = async () => {
  await database.authenticate();
  await database.sync();
};