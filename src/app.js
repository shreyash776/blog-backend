
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("./db/conn");
const authenticateToken = require('./middleware/authenticateToken');


const User = require("./models/users");
const Blog =require("./models/blog");
const app = express();
app.use(express.json());

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
  
      // Generate JWT token
      // const token = jwt.sign({ email: newUser.email }, 'secret_key');
      const token = jwt.sign({ _id: newUser._id.toString(), email: newUser.email }, 'secret_key');

      
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
      // const token = jwt.sign({ email: user.email }, 'secret_key');
      const token = jwt.sign({ _id: user._id.toString(), email: user.email }, 'secret_key');

      console.log(token);

      //decode the token
      // const data=jwt.decode(token);


      
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  
       // Protect route with JWT authentication
           // app.get('/protected', (req, res) => {
           //     const token = req.headers.authorization;
  
           //     if (!token) {
           //       return res.status(401).json({ message: 'Unauthorized' });
           //     }
  
           //     jwt.verify(token, 'secret_key', (err, decoded) => {
           //       if (err) {
           //         return res.status(403).json({ message: 'Forbidden' });
           //       }
  
           //       res.status(200).json({ message: 'Welcome to protected route' });
           //     });
           //   });

           // Start the server


     //  --------- posting blogs ---------------//

  
   // Route for posting a blog
     app.post('/post-blog', authenticateToken, async (req, res) => {
     const { name, content, imageURL } = req.body;
     const userId = req.user.userId; // Extracting user ID from the authenticated request

    try {
      // Create blog post
       const newBlog = new Blog({
          user: userId, // Assigning the user ID to the user field   
          name,
          content,
          imageURL
       });

      await newBlog.save();

      res.status(201).json({ message: 'Blog posted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
});





  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
    });