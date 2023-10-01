var express = require('express');
var router = express.Router();
var User = require('../../models/userModel');
var bcrypt = require('bcryptjs');

// Route for user registration
router.post('/signup', async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Route for user login (authentication)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
//create a new user
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  //err check
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  
  //hash the password
  bcrypt.hash(password, 10, (error, hash) => {
    if(error) {return next(error);}

    //create new user
    const newUser = new User({ username, hash });

    //save user to database
    newUser.save((err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating user.' });
      }
      return res.status(201).json(user);
    });
  })
});

//login
router.post('/login', async (req, res, next)=> {

  //search database for user
  const user = await User.findOne({username: req.body.username});

  //check if the user exists
  if(!user) {
    return res.status(404).json({message: "user not found"});
  }

  //check if the passwords match
  const validate = await bcrypt.compare(req.body.password, user.password)
  if(!validate) {
    return res.status(403).json({message: "wrong password"});
  }

  res.status(200).json(user);
});

//search for a profile by username
router.get('/user', function (req, res, next) {
	const user = User.findOne({username: req.body.username},function(err,data){
    if(!data){
      return res.status(404).json({message: "user not found"});
    }else{
      return res.status(200).json(user);
    }
	});
});

module.exports = router;