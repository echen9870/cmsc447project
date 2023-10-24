//Task Attributes
//Task ID : String
//Group ID : String
//Task Name : String
//Task Created : String
//Task Due : String
//Task Notes : String
//Completed : Bool
//Assigned ID : UserID[]
var express = require("express");
var router = express.Router();
var Task = require("../../models/taskModel");
const User = require("../../models/userModel");
var Group = require("../../models/groupModel");

// Route to find the groupId for a given task and retrieve the members of the group
router.get('/group_members_for_task/:taskId', async (req, res) => {
  try{
    const taskId = req.params.taskId;

    // Step 1: Find the task by taskId
    const task = await Task.findById(taskId);
    

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Step 2: Get the groupId from the task
    const groupId = task.groupId;

    // Step 3: Find the group associated with the groupId
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Step 4: Retrieve the members of the group
    const memberObjectIDs = group.members;

    // Fetch the usernames for the User ObjectIDs
    const membersWithUsernames = await User.find({ _id: { $in: memberObjectIDs } });

    // Extract usernames from the user documents
    const usernames = membersWithUsernames.map(user => user.username);

    res.status(200).json(usernames);

  } catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Post route to add a selected member to a task
router.post('/add_member_to_task/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const selectedMemberId = req.body.selectedMemberId;
    console.log(selectedMemberId);
    // Find objectId of user
    const user = await User.findOne({username: selectedMemberId});
    const selectedMemberID = user._id;
    console.log(user._id);

    // Step 1: Find the task by taskId
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Step 2: Add the selected member to the assignedUsers array
    task.assignedUsers.push(selectedMemberID);

    // Step 3: Save the task document to update it with the new member
    const updatedTask = await task.save();

    res.status(200).json(updatedTask); // Return the updated task
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

//Get Request By GroupID
router.get("/get_task_group/:groupID", async (req, res) => {
  try {
    const groupID = req.params.groupID;
    const tasks = await Task.find({ groupId: groupID });
    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get Request By UserID
router.get("/get_task/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find tasks assigned to the specified user
    const tasks = await Task.find({ assignedUsers: userId }).populate(
      "groupId"
    );

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for the user" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//Post Request for Task Creation
router.post("/create_task", async (req, res) => {
  console.log(req.body);
  try {
    const {
      groupId,
      name,
      description,
      assignedUsers,
      completed,
      createdAt,
      dueAt,
    } = req.body;
    const task = new Task({
      groupId,
      name,
      description,
      assignedUsers,
      completed,
      createdAt,
      dueAt,
    });
    await task.save();

    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Put Request for Task Editing
router.put("/edit_task", async (req, res) => {
  try {
    const { _id, ...taskData } = req.body;
    console.log(taskData)
    // Find the task by taskId and update it
    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      { $set: { ...taskData } },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete Request for Task Deleting
router.delete("/delete_task/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Find the task by taskId and delete it
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
