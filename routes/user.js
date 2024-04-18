const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/User.js');

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ status: false, message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashpassword  
    });
    
    await newUser.save();
    // const token = jwt.sign({ userId: user._id }, process.env.KEY, { expiresIn: '2h' });
    // res.status(200).json(email, token);
    return res.status(200).json({ status: true, message: "Record registered successfully" });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ status: false, message: "User is not registered" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ status: false, message: "Password is incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.KEY, { expiresIn: '2h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 360000 });
    // res.status(200).json(email, token);
    return res.status(200).json({ status: true, message: "Login successful", userId: user._id});
});

router.put('/userscore' ,async (req, res) => {
    const uId = req.body._id;
    const { score } = req.body;
    console.log(uId);
    try {
        const user = await User.findById(uId);
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        user.score = parseInt(score);
        await user.save();
   
        res.status(200).json({ message: 'Game Score updated!!', score: user.score });
    } catch (error) {
        console.error("Error updating:", error.message);
        res.status(400).json({ error: error.message });
    }
});

router.get('/userdetails', async (req, res) => {
  const uId = req.query._id;

  try {
      const user = await User.findById(uId);
      console.log(user);
      if (!user) {
          throw new Error('User Error');
      }

      res.status(200).json({
          email: user.email,
          score: user.score,   
          username: user.username,  
      });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}); 

router.get('/allusers', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(400).json({ error: error.message });
    }
  });
  




module.exports = router;
