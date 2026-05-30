import dbpool from "../database/db.js";    

export async function listStories(req,res) {
    const result = await dbpool.query(
        `
        SELECT s.id, s.title, s.updated_at,
        COUNT(ch.id)::int AS chapter_count
        FROM stories s
        LEFT JOIN chapters ch ON ch.story_id = s.id
        GROUP BY s.id
        ORDER BY s.updated_at DESC
        `
    );
    res.json(result.rows);
}

export async function getStory(req, res) {
  const { id } = req.params;
  const story = await dbpool.query(
    'SELECT * FROM stories WHERE id = $1', [id]
  );
  if (story.rows.length === 0) {
    return res.status(404).json({ error: 'Story not found' });
  }
  const chapters = await dbpool.query(
    'SELECT * FROM chapters WHERE story_id = $1 ORDER BY chapter_number',
    [id]
  );
  res.json({ ...story.rows[0], chapters: chapters.rows });
}

export async function createStory(req, res) {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const result = await dbpool.query(
    'INSERT INTO stories (title) VALUES ($1) RETURNING *',
    [title]
  );
  res.status(201).json(result.rows[0]);
}

export async function addChapter(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ error: 'Chapter title is required' });

  // Check story exists
  const story = await dbpool.query('SELECT id FROM stories WHERE id = $1', [id]);
  if (story.rows.length === 0) {
    return res.status(404).json({ error: 'Story not found' });
  }

  // Get next chapter number
  const maxNum = await dbpool.query(
    'SELECT COALESCE(MAX(chapter_number), 0) + 1 AS next FROM chapters WHERE story_id = $1',
    [id]
  );
  const chapterNumber = maxNum.rows[0].next;

  const result = await dbpool.query(
    `INSERT INTO chapters (story_id, title, content, chapter_number)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [id, title, content || '', chapterNumber]
  );

  // Update story's updated_at
  await dbpool.query(
    'UPDATE stories SET updated_at = NOW() WHERE id = $1', [id]
  );

  res.status(201).json(result.rows[0]);
}

export async function deleteStory(req, res) {
  const { id } = req.params;
  await dbpool.query('DELETE FROM stories WHERE id = $1', [id]);
  res.json({ message: 'Story deleted' });
}
