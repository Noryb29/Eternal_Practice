import dbpool from "../database/db.js";

export async function listCharacters(req, res) {
  const result = await dbpool.query(
    'SELECT * FROM characters ORDER BY created_at DESC'
  );
  res.json(result.rows);
}

export async function createCharacter(req, res) {
  const { name, role, race, location, gender, backstory } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const result = await dbpool.query(
    `INSERT INTO characters (name, role, race, location, gender, backstory)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, role || '', race || '', location || '', gender || '', backstory || '']
  );
  res.status(201).json(result.rows[0]);
}

export async function deleteCharacter(req, res) {
  const { id } = req.params;
  await dbpool.query('DELETE FROM characters WHERE id = $1', [id]);
  res.json({ message: 'Character deleted' });
}
