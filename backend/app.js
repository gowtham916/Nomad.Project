const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const Post = require("./models/post");
const User = require("./models/user");
const Task = require("./models/task")

const app = express();
// const crypto = require("crypto");
// const algorithm = "aes-256-cbc"; 
// const initVector = crypto.randomBytes(16);
// const Securitykey = crypto.randomBytes(32);
// const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
// const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
const bcrypt = require('bcryptjs');
mongoose
  .connect(
    "mongodb+srv://kukku:dtBC8NzRhPSiL8Rw@cluster0.d94ztuq.mongodb.net/Nomad?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

  app.post("/api/users", (req, res, next) => {
    const password = req.body.password;
    let hashedPassword = "";
  
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.log('Cannot encrypt');
          return res.status(500).json({ message: "An error occurred" });
        }
  
        hashedPassword = hash;
        console.log("hash: " + hash);
        console.log("hashedPassword: " + hashedPassword);
  
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        });
  
        user.save()
          .then(createdUser => {
            res.status(201).json({ message: "User added successfully" });
          })
          .catch(error => {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
              // Email already exists, handle the error
              res.status(400).json({ message: "Email already exists" });
            } else {
              // Other error occurred, handle accordingly
              res.status(500).json({ message: "An error occurred" });
            }
          });
      });
    });
  });
  

  app.post("/api/tasks", (req, res, next) => {
    const task = new Task({
      userId:req.body.userId,
      title: req.body.title,
      content: req.body.content
    });
    task.save().then(createdTask => {
      res.status(201).json({
        message: "Task added successfully",
        taskId: createdTask._id
      });
    });
  });
  app.post("/api/users/oauth/token", (req, res, next) => {
    const email = req.body.username;
    const password = req.body.password;
  
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            console.log('Password is correct');
  
            // Password is correct, handle the successful login here
            res.status(200).json({ message: "User found", user: user });
          } else {
            console.log('Password is incorrect');
  
            // Password is incorrect
            res.status(401).json({ message: "Invalid password" });
          }
        });
      })
      .catch(error => {
        res.status(500).json({ message: "An error occurred" });
      });
  });
  
  

  
module.exports = app;    