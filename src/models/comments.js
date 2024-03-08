const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    blogPostId:
     { type: String, required: true },

    comment: {
        type: String,
        required: true
    },
   
    timestamp:
     { type: Date,
         default: Date.now }


});







// we will create a new collection in the database

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;