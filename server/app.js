const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/api/userRoutes'); 

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://mongo:BhYSvmZJmN1ERVgO@cmsc447.ymkauhy.mongodb.net/test', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true });

app.use(express.json());

// Use the auth routes
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
