const express = require('express');
const db = require('./database');
const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  db.get('SELECT * FROM notes WHERE id = ?', [noteId], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  db.run('INSERT INTO notes (content) VALUES (?)', [content], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: this.lastID, content });
  });
});

router.put('/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  db.run('UPDATE notes SET content = ? WHERE id = ?', [content, noteId], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  const noteId = parseInt(req.params.id);

  db.run('DELETE FROM notes WHERE id = ?', [noteId], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  });
});

module.exports = router;
