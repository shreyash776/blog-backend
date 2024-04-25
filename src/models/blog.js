const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({
   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    author:{
        type:String, 
        required:true

    },
    author_mail:{
        type:String,
        required:true,
    }
    ,
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    visibility:{
        type:String,
        required:true
    }
    ,
    updatedAt: 
        { type: Date,
            default: Date.now ,
            get:function() {
                const date = this.get('updatedAt'); // Get the date value
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            }
         }
    


});


// we will create a new collection in the database

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;