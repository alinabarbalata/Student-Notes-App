const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database');
const notesRoutes = require('./notesRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/notes', notesRoutes);

function handleDatabaseError(err, res) {
  console.error('Database error:', err.message);
  return res.status(500).json({ message: 'Internal Server Error' });
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return handleDatabaseError(err, res);

    if (!row) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    bcrypt.compare(password, row.password, (bcryptErr, result) => {
      if (bcryptErr) {
        console.error('Bcrypt error:', bcryptErr.message);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      return res.status(200).json({ message: 'Login successful' });
    });
  });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Bcrypt error:', err.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
