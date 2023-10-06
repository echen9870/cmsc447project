const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  groupId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  assignedUsers: { type: [String] },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  dueAt: { type: Date }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
