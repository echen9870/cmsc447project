//Group Attributes
//Group ID : String
//Group Name : String
//Group Members : UserID[]
var express = require("express");
var router = express.Router();
var Group = require("../../models/groupModel");
const User = require("../../models/userModel");

// GET request to retrieve a list groups that memberUsername is a part of
router.get("/get_groups/:username", async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });
  try {
    const groups = await Group.find({ members: user._id }).populate(
      "name",
      "_id"
    );
    if (!groups || groups.length === 0) {
      return res
        .status(404)
        .json({ message: "No groups found for the given MemberID." });
    }

    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//Post Request By Creating Group
router.post("/create_group", async (req, res) => {
  try {
    const { name, usernameList } = req.body;

    //validate input
    if (!name) {
      return res.status(400).json({ error: "Group name is required" });
    }
    //Turns all the member strings into ObjectIds
    members = [];
    for (const username of usernameList) {
      const user = await User.findOne({ username });
      members.push(user._id);
    }
    //save group
    const group = new Group({ name, members });
    await group.save();

    res.status(201).json({ message: "Group created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// PUT request to add/delete a UserID to/from a Group
router.put("/groups/:groupId/users/:userId", async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Add or delete the UserID from the Group's members array
    if (req.body.addUser) {
      group.members.push(userId);
    } else if (req.body.deleteUser) {
      group.members.pull(userId);
    }

    const updatedGroup = await group.save();

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT request to edit the Group Name
router.put("/groups/:groupId", async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await Group.findByIdAndUpdate(
      groupId,
      { name: req.body.newName },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE request to delete a Group
router.delete("/groups/:groupId", async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await Group.findByIdAndRemove(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    res.status(204).send(); // 204 No Content response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
