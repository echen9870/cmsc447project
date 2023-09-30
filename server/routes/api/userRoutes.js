var express = require('express');
var router = express.Router();
var User = require('../../models/userModel');

//create a new user
router.post('/create', (req, res) => {
  const { username, password } = req.body;

  //err check
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  //create it
  const newUser = new User({ username, password });

  //save the database
  newUser.save((err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating user.' });
    }
    return res.status(201).json(user);
  });
});

module.exports = router;