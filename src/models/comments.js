const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  
    commentedBy:{
        type:String ,
        required:true
    },
    commentedByEmail:{
        type:String,
        required:true
    }
    ,
    blogPostId:
     { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
      },

    comment: {
        type: String,
        required: true
    },
   
    timestamp:
     { type: Date,
       default: Date.now ,
       get: v => v && v.toISOString().split('T')[0]
    }

});






// we will create a new collection in the database

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;