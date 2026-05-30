import dbpool from "../database/db.js";

export async function listLocations(req, res) {
  const result = await dbpool.query(
    'SELECT * FROM locations ORDER BY created_at DESC'
  );
  res.json(result.rows);
}

export async function createLocation(req, res) {
  const { name, alt_names, landmarks, environment, lore } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const result = await dbpool.query(
    `INSERT INTO locations (name, alt_names, landmarks, environment, lore)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, alt_names || '', landmarks || '', environment || '', lore || '']
  );
  res.status(201).json(result.rows[0]);
}

export async function deleteLocation(req, res) {
  const { id } = req.params;
  await dbpool.query('DELETE FROM locations WHERE id = $1', [id]);
  res.json({ message: 'Location deleted' });
}
