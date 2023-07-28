const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  userId: { type: String, required: true }, 
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: {type:String, required:true},
  timestamp:{type:Date,required:true}
});

module.exports = mongoose.model('task', taskSchema);