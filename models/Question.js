const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema({

    question: {type:String},
    solution: {type: Number}
    
}, { timestamps: true });

module.exports = mongoose.model("Question" , QuestSchema);
