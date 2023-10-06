const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] //an array for multiple members
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
