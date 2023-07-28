const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Task = require("./models/task");
const XLSX = require('xlsx');
const app = express();
const cors = require("cors");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
mongoose.connect('mongodb://127.0.0.1:27017/Nomad', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((error) => {
    console.log('Connection failed:', error);
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
            res.status(400).json({ message: "Email already exists" });
          } else {
            res.status(500).json({ message: "An error occurred" });
          }
        });
    });
  });
});

app.post("/api/tasks", async (req, res, next) => {
  try {
    console.log(req.body);
    const currentTime = new Date().toISOString(); 
    console.log(currentTime);
    const task = new Task({
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      timestamp: currentTime

    });
    console.log(task);
    const createdtask = await task.save();
    res.status(201).json({
      message: "Post added successfully",
      taskId: createdtask._id,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error });
  }
});

app.post('/api/tasks/bulk', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const file = req.file;
    const userId = req.query.userId;
    console.log('Request File:', file);
    console.log(req.query.userId);
    fs.readFile(file.path,'binary',async (err, fileData)=>{
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ message: 'Error reading file' });
      }
      const workbook = XLSX.read(fileData, { type: 'binary' });
      const worksheet = workbook.Sheets['template'];
      if (!worksheet) {
        return res.status(400).json({ message: 'Invalid worksheet' });
      }
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('Parsed JSON Data:', jsonData);
      const currentTime = new Date().toISOString();
      const tasks = jsonData.map((row) => {
        return {
          userId: userId,
          title: row[0],
          content: row[1],
          status: row[2],
          timestamp: currentTime
        };
      });
      console.log('Extracted tasks:', tasks);
      const createdTasks = await Task.insertMany(tasks);
      console.log('Created tasks:', createdTasks);
      res.status(201).json({
        message: 'Bulk data added successfully',
        taskIds: createdTasks.map((task) => task._id),
      });
    })
   
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});


app.get('/api/tasks', async (req, res) => {
  const userId = req.query.userId;
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const pagesizeF = +req.query.pagesize2;
  const currentPageF = +req.query.page2;
  const searchTerm = req.query.q;

  try {
    const queryP = {
      userId: userId,
      status: "PENDING",
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } }
      ]
    };

    const queryF = {
      userId: userId,
      status: "FINISHED",
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } }
      ]
    };
    const pendingTasksQuery = Task.find(queryP);

    if (pageSize && currentPage) {
      pendingTasksQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    const fetchedTasks = await pendingTasksQuery.exec();
    const count = await Task.count(queryP).exec();
    const finishedTasksQuery = Task.find(queryF);

    if (pagesizeF && currentPageF) {
      finishedTasksQuery.skip(pagesizeF * (currentPageF - 1)).limit(pagesizeF);
    }

    const fetchedTasksF = await finishedTasksQuery.exec();
    const countF = await Task.count(queryF).exec();
    const hasDataPendingTasks = fetchedTasks.length > 0;
    const hasDataFinishedTasks = fetchedTasksF.length > 0;

    res.status(200).json({
      message: "Tasks fetched successfully!",
      hasDataPendingTasks: hasDataPendingTasks,
      tasks: fetchedTasks,
      totalTasks: count,
      hasDataFinishedTasks: hasDataFinishedTasks,
      taskF: fetchedTasksF,
      totalTasksF: countF
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks.",
      error: error.message
    });
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

app.put("/api/tasks/finish/:id", (req, res, next) => {
  const taskId = req.params.id;
  const newStatus = req.body.status;
  const newTime = new Date().toISOString();
  console.warn(req.body);

  Task.updateOne({ _id: taskId }, { status: newStatus ,timestamp:newTime})
    .then(result => {
      res.status(200).json({ message: "Update successful!" });
      console.log('updated');
    })
    .catch(error => {
      res.status(500).json({ message: "An error occurred during the update process." });
    });
});

app.put("/api/tasks/:id", (req, res, next) => {
  const taskId = req.params.id;
  const newTitle = req.body.title;
  const newContent = req.body.content;
  Task.updateOne({ _id: taskId }, { title: newTitle ,content: newContent })
    .then(result => {
      res.status(200).json({ message: "Update successful!" });
      console.log('updated');
    })
    .catch(error => {
      res.status(500).json({ message: "An error occurred during the update process." });
    });
});

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
          res.status(200).json({ message: "User found", user: user });
        } else {
          console.log('Password is incorrect');
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
