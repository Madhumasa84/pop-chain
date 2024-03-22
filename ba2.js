// Import required modules
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// Create an instance of Express
const app = express();
const port = 3000;

// MongoDB connection URI
const uri = "mongodb://localhost:27017";
const dbName = 'loginDB';
const collectionName = 'users';

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware to authenticate users
const authenticateUser = async (req, res, next) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;

    // Connect to MongoDB server
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);

    // Find user with provided username
    const user = await db.collection(collectionName).findOne({ username });

    // If user not found, return error
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare provided password with hashed password from database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords match, allow access
    if (passwordMatch) {
      req.user = user; // Attach user object to request
      next(); // Move to next middleware or route handler
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Endpoint to authenticate users
app.post('/login', authenticateUser, (req, res) => {
  res.json({ message: 'Login successful', user: req.user });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
