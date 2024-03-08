const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({
  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
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
    }


});


// we will create a new collection in the database

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;