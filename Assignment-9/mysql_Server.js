const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1653',
  database: 'formdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// POST /submit-form
app.post('/submit-form', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO forms (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    res.json({ message: 'Form submitted successfully!', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting form' });
  }
});

// GET /forms
app.get('/forms', async (req, res) => {
  try {
    const [forms] = await pool.execute('SELECT * FROM forms');
    res.json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching forms' });
  }
});

// PUT /forms/:id
app.put('/forms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, message } = req.body;

    const [result] = await pool.execute(
      'UPDATE forms SET name = ?, email = ?, message = ? WHERE id = ?',
      [name, email, message, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json({ message: 'Form updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating form' });
  }
});

// DELETE /forms/:id
app.delete('/forms/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM forms WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json({ message: 'Form deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting form' });
  }
});

// Server Start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
