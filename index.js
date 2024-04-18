const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');


dotenv.config();

const userRouter = require('./routes/user.js');
const questionRouter = require('./routes/question.js');


const app = express();
app.use(express.json());
app.use(cors({
    origin:["http://localhost:5181"],
    credentials:true
}))
app.use(cookieParser())
app.use('/auth', userRouter);
app.use('/game', questionRouter);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
//lsof -i :3003


