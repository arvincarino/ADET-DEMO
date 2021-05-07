"use strict";
const {Model} = require('sequelize');

const PROTECTED_ATTRIBUTES = ["password","birth_date"];
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(User, {
        as: "created",
        foreignKey: "created_by",
      });
      this.belongsTo(User, {
        as: "updated",
        foreignKey: "updated_by",
      });

      this.hasMany(models.Task,{
        as: "user_task",
        foreignKey: "created_by",
      });
    }

    toJSON(){
      const attributes = {...this.get() };

      for (const a of PROTECTED_ATTRIBUTES){
        delete attributes[a];
      }
      return attributes;
      //return{...this.get(), password: undefined};
    }
  };
  User.init({
    id:{
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue: DataTypes.UUIDV4,
    },
    first_name:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull : {msg : "First name should not be null."},
        notEmpty : {msg : "First name should not be empty."}
      },
      get(){
        const rawValue = this.getDataValue('first_name');
        return rawValue ? rawValue.toUpperCase(): null;
      },
    },
    middle_name:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull : {msg : "Middle name should not be null."},
        notEmpty : {msg : "Middle name should not be empty."}
      },
    },
    last_name:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull : {msg : "Last name should not be null."},
        notEmpty : {msg : "Last name should not be empty."}
      },
    },
    full_name:{
      type: DataTypes.STRING,
      set(value){
        this.setDataValue(
          "full_name",
        this.first_name + " " + this.middle_name +" "+this.last_name
        );
      },
    },
    profile_pic:{type: DataTypes.STRING, get(){
      const rawValue = this.getDataValue("profile_pic");
      return rawValue ? "http//localhost:3600/public/" + rawValue: null;
    },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull : false,
      validate :{ 
        isIn : {
        args: [['Male', 'Female']],
        msg : "Gender should be Male or Female.",
        },
      },
    },
    civil_status: {
      type: DataTypes.STRING,
      allowNull : false
    },
    birth_date :{
      type: DataTypes.DATE,
      allowNull : false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{ isEmail: true},
      unique: "email",
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    status:{
      type: DataTypes.STRING, defaultValue: 'ACTIVE'
    },
    created_by :{
      type: DataTypes.UUID,
      references : {
        model : User,
        key : "id"
      },
    },
    updated_by :{
      type: DataTypes.UUID,
      references : {
        model : User,
        key : "id"
      },
    },
  }, 
  {
    sequelize,
    timestamps: true,
    createdAt: "date_created",
    updatedAt: "date_updated",
    modelName: 'User',
  });
  return User;
};