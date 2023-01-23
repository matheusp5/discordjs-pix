import { DataTypes } from "sequelize"

const Payment = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    member_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment_status: {
        type: DataTypes.STRING,
        defaultValue: "pending"
    },
    external_reference: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mp_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}

export default Payment