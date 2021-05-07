const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (data) => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: "7200s" });
  };

exports.login = (req, res) => {
    // check if email and password is not empty
    if (String(req.body.email) === "" || String(req.body.password) === "") {
      res.status(500).send({
        error: true,
        data: [],
        message: ["Username or Password is empty."],
      });
    }
  
    User.findOne({ where: { email: req.body.email, status:"Active" } })
      .then((data) => {
        if (data) {
          bcrypt.compare(
            req.body.password,
            data.password,
            function (err, result) {
              // if same or not same
              if (result) {
                res.send({
                  error: false,
                  data: data,
                  token: generateToken({
                    id: data.id,
                    name: data.full_name,
                    email: data.email,
                  }),
                  message: [process.env.SUCCESS_RETRIEVED],
                });
              } else {
                // if not equal
                res.status(500).send({
                  error: true,
                  data: [],
                  message: ["Invalid username and Password."],
                });
              }
            }
          );
        } else {
          res.status(500).send({
            error: true,
            data: [],
            message: ["Username does not exists."],
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          error: true,
          data: [],
          message:
            err.errors.map((e) => e.message) || process.env.GENERAL_ERROR_MSG,
        });
      });
  };