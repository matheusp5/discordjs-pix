import { Sequelize, DataTypes } from "sequelize"
import Payment from "./models/Payment.js"

let models = []

const sequelize = new Sequelize(
    "discordmx",
    "root",
    "",
    {
        host: "localhost",
        dialect: "mysql"
    }
)

let PaymentModel = sequelize.define("payments", Payment)
models.push(PaymentModel)

export default {
    sql: sequelize,
    models: models
}