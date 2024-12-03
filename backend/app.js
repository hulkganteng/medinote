const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');  // Mengimpor koneksi database
require('dotenv').config();  // Memuat variabel dari file .env

// Membuat server Express
const app = express();
const port = process.env.APP_PORT || 5000;  // Menggunakan APP_PORT dari .env atau 5000 jika tidak ada

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Menambahkan note baru
app.post('/api/notes', (req, res) => {
  const { title, note } = req.body;
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Format datetime

  const query = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
  db.query(query, [title, datetime, note], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: result.insertId, title, datetime, note });
    }
  });
});

// Menampilkan semua notes
app.get('/api/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

// Menampilkan satu note berdasarkan id
app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM notes WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Mengubah note
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, note } = req.body;
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Format datetime

  const query = 'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?';
  db.query(query, [title, datetime, note, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json({ id, title, datetime, note });
    }
  });
});

// Menghapus note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM notes WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Note deleted');
    }
  });
});

// Memulai server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
