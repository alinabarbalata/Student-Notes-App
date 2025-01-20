const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database'); // Use the shared database instance
const notesRoutes = require('./notesRoutes'); // Import notes routes

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/notes', notesRoutes); // Use the notes routes

// Error handling utility
function handleDatabaseError(err, res) {
  console.error('Database error:', err.message);
  return res.status(500).json({ message: 'Internal Server Error' });
}

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check if the user exists in the database
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return handleDatabaseError(err, res);

    if (!row) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare hashed password
    bcrypt.compare(password, row.password, (bcryptErr, result) => {
      if (bcryptErr) {
        console.error('Bcrypt error:', bcryptErr.message);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Login successful
      return res.status(200).json({ message: 'Login successful' });
    });
  });
});

// Registration Route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Hash password before saving it
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Bcrypt error:', err.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Insert user into the database
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
