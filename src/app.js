
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
  require("./db/conn");
const authenticateToken = require('./middleware/authenticateToken');
const User = require("./models/users");
const Blog =require("./models/blog");
const Comment =require("./models/comments");
const app = express();
const cors=require('cors');
const path = require('path');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

console.log("I am running")


app.use(express.static(path.join(__dirname, '../Wordcraft/dist')));


// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      const token = jwt.sign({ _id: newUser._id.toString(), email: newUser.email,name:newUser.name }, secretKey);

      
      res.status(201).json({ message: 'User created', token });
    } catch (error) { 
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Login route
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      
      const token = jwt.sign({ _id: user._id.toString(), email: user.email, name:user.name }, 'secret_key');

      console.log(token);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

     //  <--------- posting blogs --------------->
    

   // <--------------Route for posting a blog------------>
     app.post('/post-blog', authenticateToken, async (req, res) => {
     const {title,content,imageURL,visibility } = req.body;
     const userId = req.user._id;
     const author_mail=req.user.email;
     const author_name=req.user.name;
     console.log(author_mail);
      // Extracting user ID from the authenticated request
    try {
      // Create blog post
       const newBlog = new Blog({
          user: userId, // Assigning the user ID to the user field   
          author:author_name,
          author_mail:author_mail,
          title,
          content,
          imageURL,
          visibility,
       });

      await newBlog.save();

      res.status(201).json({ message: 'Blog posted successfully',newBlog });
  } catch (error) {
    console.log("actual error:",error)
      res.status(500).json({ message: 'Internal server error' });
  }
});
  



   

 // route to get the blogs from data base
   app.get('/get-blogs', async (req, res) => {
   try {
    console.log("getting blogs");
    // Fetch all blogs from the database
    const blogs = await Blog.find();   
    // If there are no blogs, return a 404 status
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ blogs:[], message: 'No blogs found' });
    }

    // If there are blogs, return them
    res.status(200).json({ blogs });
  } catch (error) {
    console.log("actual error:",error)
    res.status(500).json({ message: 'Internal server error' });
  }
});

// testing api
app.get('/', async (req, res) => {
  try {

console.log("hhghh")
   
   res.status(200).json("hello from sever side");
 } catch (error) {
   console.log("actual error:",error)
   res.status(500).json({ message: 'Internal server error' });
 }
});

  





     //      <------- POST endpoint for submitting comments ---------->

app.post('/comments',authenticateToken,async (req, res) => {
  try { 
    const { blogPostId,comment } = req.body;
    const commentedBy = req.user.name;
    const commentedByEmail=req.user.email;
    // Create a new comment document 
    const newComment = new Comment({
      blogPostId,
      commentedByEmail:commentedByEmail,
      commentedBy:commentedBy,
      comment
    });

    // Save the new comment to the database
    await newComment.save();

    res.status(201).json({ message: 'Comment posted successfully.' });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: 'Failed to post comment.' });
  }
});

   //<-------------route for getting the comments --------------->
   app.get('/get-comments/:blogPostId', async (req, res) => {
    try {
      const { blogPostId } = req.params;
      
      // Find comments associated with the specified blog post ID
      const comments = await Comment.find({ blogPostId });
  
      res.status(200).json({ comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments.' });
    }
  });





// <-------------- route for deleting blog ------------------>

app.delete('/delete-blog', async (req, res) => {
  const blogId = req.body.blogId;
 
  
  try {
    // Check if the blog post exists and belongs to the authenticated user
    const blog = await Blog.findOne({ _id: blogId});
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }

    // Delete the blog post
    await Blog.deleteOne({ _id: blogId });

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});








// <--------------searching blogs ---------------->
// Search endpoint
app.get('/search-blogs', async (req, res) => {
  const {query} = req.query; // Query parameter for search term

  if (!query) {
      return res.status(400).json({ error: 'Query parameter is required.' });
  }
  const blogs = await Blog.find();   
    
  const searchResults = blogs.filter(blog =>
      blog.title.toLowerCase().includes(query.toLowerCase()) ||
      blog.author.toLowerCase().includes(query.toLowerCase())
  );

  res.json({searchResults});

});

//   <------------------Editing the blogs -------------------->

app.patch('/edit-blog', authenticateToken, async (req, res) => {
  const blogId = req.body.blogId;
  // const userId = req.user._id; // Extracting user ID from the authenticated request
  const visibility=req.body.visibility;
  const {content} = req.body;

  try {
    // Check if the blog post exists and belongs to the authenticated user
    console.log(req.body)
    const blog = await Blog.findOne({ _id: blogId });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }

    // Update the content field
    if (content) {
      blog.content = content;
    }
    if(visibility){
      blog.visibility=visibility
    }

    // Save the updated blog post
    await blog.save();

    res.status(200).json({ message: 'Blog content updated successfully', blog });
  } catch (error) {
    console.error('Error updating blog content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
    });