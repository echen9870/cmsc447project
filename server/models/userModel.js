var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//user schema
var userSchema = new Schema({
  username: String,
  password: String,
});

//create user
var User = mongoose.model('User', userSchema);


//todoList schema
var todoListSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
});
var TodoList = mongoose.model('TodoList', todoListSchema);


//Task schema
var taskSchema = new Schema({
  list_id: { type: Schema.Types.ObjectId, ref: 'TodoList' },
  description: String,
  due_date: Date,
  is_completed: Boolean
});
var Task = mongoose.model('Task', taskSchema);


//group schema
var groupSchema = new Schema({
  group_name: String,
  creator_id: { type: Schema.Types.ObjectId, ref: 'User' }
});
var Group = mongoose.model('Group', groupSchema);


//group member schema
var groupMemberSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: 'Group' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});
var GroupMember = mongoose.model('GroupMember', groupMemberSchema);


//group task schema
var groupTaskSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: 'Group' },
  description: String,
  due_date: Date,
  is_completed: Boolean,
  assigner_id: { type: Schema.Types.ObjectId, ref: 'User' }
});
var GroupTask = mongoose.model('GroupTask', groupTaskSchema);


//message schema
var messageSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: 'Group' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  timestamp: Date
});
var Message = mongoose.model('Message', messageSchema);

module.exports = {
  User: User,
  TodoList: TodoList,
  Task: Task,
  Group: Group,
  GroupMember: GroupMember,
  GroupTask: GroupTask,
  Message: Message
};