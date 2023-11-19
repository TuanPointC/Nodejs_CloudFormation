const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3001;

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'default-hostname',
  user: process.env.DB_USER || 'default-username',
  password: process.env.DB_PASSWORD || 'default-password',
  port: process.env.DB_PORT || 'default-database',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
  } else {
    db.connect(function(err) {
      if (err) throw err;
  
      db.query('CREATE DATABASE IF NOT EXISTS main;');
      db.query('USE main;');
      db.query('CREATE TABLE IF NOT EXISTS users(id int NOT NULL AUTO_INCREMENT, username varchar(30), email varchar(255), PRIMARY KEY(id));', function(error, result, fields) {
          console.log(result);
      });
  });
    console.log('Connected to MySQL database');
  }
});

app.use(cors());
app.use(bodyParser.json());

// CRUD operations

// Create
app.post('/users', (req, res) => {
  const { username, email } = req.body;
  const sql = 'INSERT INTO users (username, email) VALUES (?, ?)';
  db.query(sql, [username, email], (err, result) => {
    if (err) {
      console.error('Error creating user: ', err);
      res.status(500).send('Error creating user');
    } else {
      res.status(201).send('User created successfully');
    }
  });
});

// Read
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users: ', err);
      res.status(500).send('Error fetching users');
    } else {
      res.json(results);
    }
  });
});

// Update
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;
  const sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
  db.query(sql, [username, email, userId], (err, result) => {
    if (err) {
      console.error('Error updating user: ', err);
      res.status(500).send('Error updating user');
    } else {
      res.send('User updated successfully');
    }
  });
});

// Delete
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user: ', err);
      res.status(500).send('Error deleting user');
    } else {
      res.send('User deleted successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}, ${process.env.DB_HOST, process.env.DB_USER}`);
});
