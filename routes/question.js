const express = require('express');
const axios = require('axios');
const router = express.Router();
const Question = require('../models/Question'); 


router.get('/quest', async (req , res) => { 
    try {
        const response = await axios.get('https://marcconrad.com/uob/tomato/api.php?out=json');
        const { question, solution } = response.data;
        
       
        const newQuestion = new Question({
            question,
            solution 
        });
        await newQuestion.save();
        
        res.json(newQuestion); 
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error'});
    }
});

module.exports = router;
