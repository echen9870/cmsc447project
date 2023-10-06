//Group Attributes
//Group ID : String
//Group Name : String
//Group Members : UserID[]
var express = require('express');
var router = express.Router();
var Group = require('../../models/groupModel');

//Get Request By MemberID

//Post Request By Creating Group
router.post('/create_task', async (req, res) => {
    console.log(req.body);
    try {
      const { name, members } = req.body;
  
      //validate input
      if (!name) {
        return res.status(400).json({ error: 'Group name is required' });
      }

      //save group
      const group = new Group({ name, members });
      await group.save();
  
      res.status(201).json({ message: 'Group created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

//Put Request for Adding/Deleting UserID

//Put Request for Editing Group Name

//Delete Request for Deleting Group