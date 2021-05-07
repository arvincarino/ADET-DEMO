const db = require('../models');
const User= db.User;
const bcrpyt = require("bcrypt");
const datatable = require('sequelize-datatables');

exports.findDataTable = (req, res) => {
    req.body = {
      draw: "1",
      columns: [
        {
          data: "full_name",
          name: "",
          searchable: "true",
          orderable: "true",
          search: {
            value: "",
            regex: "false",
          },
        },
      ],
      order: [
        {
          column: "0",
          dir: "asc",
        },
      ],
      start: "0",
      length: "10",
      search: {
        value: "",
        regex: "false",
      },
      _: "1478912938246",
    };
  
    datatable(User, req.body).then((result) => {
      // result is response for datatables
      res.json(result);
    });
  };
//create and save user
exports.create = async (req, res)=>{
    console.log(req.file);
    req.body.profile_pic = req.file != undefined ? req.file.filename:"";
    req.body.full_name = "";

    req.body.created_by = req.user.id;

   req.body.password = await bcrpyt.hash( req.body.password, parseInt(process.env.SALT_ROUND)
    );

    User.create(req.body, {include: ["user_task"]})
        .then((data) =>{
            User.findByPk(data.id, {include: ["created", "user_task"]}).then((result)=>{
                res.send({
                    error : false,
                    data : result,
                    message : [process.env.SUCCESS_CREATE],
                });
            });
    })

    .catch((err)=>{
     res.status(500).send({
         error : true,
         data : [],
         message : err.errors.map((e)=>e.message),
     });
    });
};

//retrieve all user from db
exports.findAll = (req, res) => {
  User.findAll({where :{status : "Active" }, 
  //attributes: ["id", "first_name"],
  include : [
      "created", {model :db.Task, as :"user_task", include:[{model : db.User, as: "created", attributes:["id", "full_name"]},
      ],
},
],
})
  .then((data) => {
    res.send({
        error : false,
        data : data,
        message : ["Retrieved successfully."]
    });
  })
  .catch((err)=>{
    res.status(500).send({
        error : true,
        data : [],
        message : err.errors.map((e)=>e.message),
    });

  });
};

//FIND A SINGLE USER WITH AN ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id).then((data)=>{
        res.send({
            error : false,
            data : data,
            message : [process.env.SUCCESS_RETRIEVED],
        });
    })
    .catch((err)=>{
        res.status(500).send({
            error : true,
            data : [],
            message : err.errors.map((e)=>e.message) || process.env.GENERAL_ERROR_MSG,
        });
    });
};

//update a user by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id
    req.body.full_name = "";

    if (req.body.password){
        req.body.password = await bcrpyt.hash(
            req.body.password,
            parseInt(process.env.SALT_ROUNDS)
        );
    }
    User.update(req.body, {
        where : {id : id}

    }).then((result) => {
        console.log(result);
        if (result){
            //success     
            User.findByPk(id, {include :["user_task"]}).then((data)=>{
                res.send({
                    error: false,
                    data: data,
                    message: [process.env.SUCCESS_UPDATED],
                });
            });
        }
        else{
            //error in updating
            res.status(500).send({
                error:true,
                data:[],
                message: ["Error in updating a record"],
            });
        }
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send({
            error: true,
            data: [],
            message:
            err.errors.map((e)=>e.message)|| process.env.GENERAL_ERROR_MSG,

        });
    });
};

//delete a user with the specified id in the request
exports.delete = (req, res) => {
//update of user status
const id = req.params.id;
const body = {status: "Inactive"}
    User.update(body, {
        where : {id : id}

    }).then((result) => {
        if (result){
            //success     
            User.findByPk(id).then((data)=>{
                res.send({
                    error: false,
                    data: data,
                    message: [process.env.SUCCESS_UPDATED],
                });
            });
        }
        else{
            //error in updating
            res.status(500).send({
                error:true,
                data:[],
                message: ["Error in updating a record"],
            });
        }
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send({
            error: true,
            data: [],
            message:
            err.errors.map((e)=>e.message)|| process.env.GENERAL_ERROR_MSG,

        });
    });
};