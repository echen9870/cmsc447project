const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const Task = require("../../models/taskModel");
const Group = require("../../models/groupModel");
const AllTasks = require("../../models/AllTasksModel")
const crypto = require("crypto");

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString("hex");
};

// Route for user registration
router.post("/create_user", async (req, res) => {
  try {
    const { username, password, email, confirmPassword } = req.body;

    //validate input
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }
    //check if email is valid
    var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!validEmail.test(email)) {
      console.log("Invalid email");
      return res.status(409).json({ error: "Invalid email" });
    }
    //check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("Email already exists");
      return res.status(409).json({ error: "Email already exists" });
    }
    //check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("Username already exists");
      return res.status(409).json({ error: "Username already exists" });
    }
    //If passwords don't match
    if (password != confirmPassword) {
      console.log("Passwords don't match");
      return res.status(400).json({ error: "Passwords don't match" });
    }

    //hash password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route for user login (authentication)
router.post("/login_user", async (req, res) => {
  try {
    const { username, password } = req.body;

    //validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });

    //check if user exists
    if (!user) {
      console.log("Username does not exist");
      return res.status(401).json({ error: "Incorrect Username or Password." });
    }

    // Compare the input password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate and return a JWT token for authenticated requests
      const token = jwt.sign({ userId: user._id }, generateSecretKey(), {
        expiresIn: "1h",
      });
      return res.status(200).json({ message: "Login successful", token });
    } else {
      console.log("incorrect password");
      return res.status(401).json({ error: "Incorrect Username or Password." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});


router.post("/password_recovery", async (req, res) => {
  try {
    const { usernameOrEmail, newPassword, confirmPassword } = req.body;

    //validate input
    if (!usernameOrEmail || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Username, Email, and Password are required" });
    }

    //find user by their unique value of username or email
    const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });

    //check if user exists
    if (!user) {
      console.log("Username or email does not exist");
      return res.status(401).json({ error: "Username or Email does not exist" });
    }

    //passwords don't match
    if (newPassword !== confirmPassword) {
      console.log("Passwords don't match");
      return res.status(400).json({ error: "Passwords don't match" });
    }

    //hash the new password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    //update the user's password in the database
    user.password = hashedPassword;

    await user.save(); //save the updated user in the database

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }

});

router.delete("/delete_user/:username", async (req, res) => {
  const usernameID = req.params.username;
  try {
    const user = User.findOne({ username: usernameID });
    // Find all the owned groups
    var ownedGroup = Group.findOne({ owner: user._id })
    while(ownedGroup) {
      // Delete all group tasks
      await Task.deleteMany({ groupId: ownedGroup._id });
      await AllTasks.deleteMany({ groupId: ownedGroup._id })
      //Delete the group
      await Group.deleteOne({ _id: ownedGroup._id });
      ownedGroup = Group.findOne({ owner: user._id });
    }
    // Remove the user from all assigned tasks
    await AllTasks.deleteMany({ userId: user._id });
    await Task.updateMany({}, { $pull: { assignedUsers: user.username }});
    // Remove the user from all groups they're in
    await Group.updateMany({}, { $pull: { members: user._id }})
    // Delete the actual user
    await User.deleteOne({ _id: user._id });
    res.status(204).send(); // 204 No Content response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
