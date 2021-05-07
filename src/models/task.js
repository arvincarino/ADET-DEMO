"use strict";
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: "created",
        foreignKey: "created_by",
      });
      this.belongsTo(models.User, {
        as: "updated",
        foreignKey: "updated_by",
      });
    }
  }

  Task.init({
    id:{
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue: DataTypes.UUIDV4,
    },
    task_name:{ type:DataTypes.STRING, allowNull: false},
    task_description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    task_type:{
        type:DataTypes.TEXT,
        allowNull: false,
        validate:{
            isIn:{
                args:[["School", "Work", "Personal", "Others"]],
                msg: "Task Type should School, Work, Personal",
            },
        },
    },
    task_deadline: {
        type: DataTypes.DATE,
    },
    status:{type: DataTypes.STRING, defaultValue:"Pending"},
    created_by: {
        type:DataTypes.UUID,
        references: {
            model: sequelize.User,
            key:"id",
        },
    },
    updated_by: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.User,
            key: "id",
        },
    },
},
{
    sequelize,
    timestamps: true,
    createdAt: "date_created",
    updatedAt: "date_updated",
    modelName: "Task",
    }
  );
 return Task;
};