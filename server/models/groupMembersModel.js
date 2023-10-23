const mongoose = require('mongoose');

const groupMembersSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true},
  userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true},
});

// Create the Group Members model
const GroupMembers = mongoose.model('GroupMembers', groupMembersSchema);

module.exports = GroupMembers;