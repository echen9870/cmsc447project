//Task Attributes
//Task ID : String
//Group ID : String
//Task Name : String
//Task Created : String
//Task Due : String
//Task Notes : String
//Completed : Bool
//Assigned ID : UserID[]
var express = require('express');
var router = express.Router();
var Task = require('../../models/taskModel');

//Post Request

//Get Request By GroupID
router.get('/get_task', function (req, res, next) {
	const task = Task.findOne({groupId: req.body.groupId}, function(err,data) {
    if (!data) {
      return res.status(404).json({message: "task not found"});
    } else {
      return res.status(200).json(task);
    }
  });
});

//Get Request By UserID

//Post Request for Task Creation
router.post('/create_task', async (req, res) => {
    console.log(req.body);
    try {
      const { groupId, name, description, assignedUsers, completed, createdAt, dueAt } = req.body;
  
      //validate input
      if (!groupId || !name) {
        return res.status(400).json({ error: 'Group id and task name are required' });
      }

      //save task
      const task = new Task({ groupId, name, description, assignedUsers, completed, createdAt, dueAt });
      await task.save();

      res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

//Put Request for Task Editing

//Delete Request for Task Deleting