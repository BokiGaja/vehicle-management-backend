const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3500;

app.use(cors());
app.use(bodyParser.json());

const initDB = async () => {
  const db = await open({
    filename: './vehicles.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_plate TEXT UNIQUE NOT NULL,
      manufacturer TEXT NOT NULL,
      vin TEXT UNIQUE NOT NULL,
      custom_name TEXT,
      slug TEXT UNIQUE NOT NULL
    );
  `);

  return db;
};

const dbPromise = initDB();

app.get('/vehicles', async (req, res) => {
  const db = await dbPromise;
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  const offset = (page - 1) * limit;

  try {
    const vehicles = await db.all('SELECT * FROM vehicles LIMIT ? OFFSET ?', [limit, offset]);
    const total = await db.get('SELECT COUNT(*) as count FROM vehicles');

    res.json({
      vehicles,
      total: total.count,
      page,
      limit,
      hasMore: offset + limit < total.count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/vehicles/:slug', async (req, res) => {
  const db = await dbPromise;
  const vehicle = await db.get('SELECT * FROM vehicles WHERE slug = ?', req.params.slug);
  if (vehicle) {
    res.json(vehicle);
  } else {
    res.status(404).json({ message: 'Vehicle not found' });
  }
});

app.post('/vehicles', async (req, res) => {
  const { license_plate, manufacturer, vin, custom_name } = req.body;
  const slug = `${custom_name.trim().replace(/\s+/g, '-')}-${license_plate.trim().replace(/\s+/g, '-')}`.toLowerCase();
  try {
    const db = await dbPromise;
    const result = await db.run(
      'INSERT INTO vehicles (license_plate, manufacturer, vin, custom_name, slug) VALUES (?, ?, ?, ?, ?)',
      [license_plate, manufacturer, vin, custom_name, slug]
    );
    res.json({ id: result.lastID, license_plate, manufacturer, vin, custom_name, slug });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/vehicles/:id', async (req, res) => {
  const { license_plate, manufacturer, vin, custom_name } = req.body;
  const slug = `${custom_name.trim().replace(/\s+/g, '-')}-${license_plate.trim().replace(/\s+/g, '-')}`.toLowerCase();
  try {
    const db = await dbPromise;
    await db.run(
      'UPDATE vehicles SET license_plate = ?, manufacturer = ?, vin = ?, custom_name = ?, slug = ? WHERE id = ?',
      [license_plate, manufacturer, vin, custom_name, slug, req.params.id]
    );
    res.json({ id: req.params.id, license_plate, manufacturer, vin, custom_name, slug });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
