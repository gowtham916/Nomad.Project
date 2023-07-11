const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const cors = require("cors");

mongoose
  .connect("mongodb+srv://kukku:dtBC8NzRhPSiL8Rw@cluster0.d94ztuq.mongodb.net/Nomad?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false
  }));

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
  res.setHeader("Access-Control-Allow-Credentials", "true");
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

app.post("/api/tasks", async (req, res, next) => {
  try {
    console.log(req.body); // Print req.body
    const task = new Task({
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
      status: req.body.status
    });

    const createdtask = await task.save();
    res.status(201).json({
      message: "Post added successfully",
      taskId: createdtask._id,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error });
  }
});

app.get('/api/tasks', async (req, res) => {
  const { userId } = req.query;
  try {
    const tasks = await Task.find({ userId: userId }).exec();
    res.status(200).json({ message: 'Success get all', tasks: tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error: error });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  console.log(taskId);
  try {
     const task = await Task.findOne({ _id: taskId }).exec();
     if (task) {
        res.status(200).json({ message: 'Success get one', tasks: task });
     } else {
        res.status(404).json({ message: 'Task not found' });
     }
  } catch (error) {
     res.status(500).json({ message: 'Error retrieving task', error: error });
  }
});


app.patch("/api/tasks/:id", (req, res, next) => {
  const taskId = req.params.id;
  const newStatus = req.body.status;
  console.warn(req.body);
  // console.warn(req.params);
  // console.warn(req);

  Task.updateOne({ _id: taskId }, { status: newStatus })
    .then(result => {
      res.status(200).json({ message: "Update successful!" });
      console.log('updated');
    })
    .catch(error => {
      res.status(500).json({ message: "An error occurred during the update process." });
    });
});

app.put("/api/tasks/:id",(req, res, next)=>{
  const taskId = req.params.id;
  const newTitle = req.body.title;
  const newContent = req.body.content;
  Task.updateOne({ _id: taskId }, { title: newTitle }, {content: newContent})
  .then(result => {
    res.status(200).json({ message: "Update successful!" });
    console.log('updated');
  })
  .catch(error => {
    res.status(500).json({ message: "An error occurred during the update process." });
  });
})

app.post("/api/users/oauth/token", (req, res, next) => {
  const email = req.body.username;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      console.log(user);
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

app.delete("/api/tasks/:id", (req, res, next) => {
  console.log("dlt api calling");
  Task.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: "task deleted!" });
  });
});

module.exports = app;
