import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dbpool from './database/db.js';
import storyRouter from './routes/storyRoutes.js';
import characterRouters from './routes/characterRoutes.js';
import locationRouter from './routes/locationRouters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API routes
app.use('/api/stories', storyRouter);
app.use('/api/characters', characterRouters);
app.use('/api/locations', locationRouter);

// Run schema on startup
const schema = fs.readFileSync(path.join(__dirname,'database', 'schema.sql'), 'utf8');
dbpool.query(schema).then(() => {
  console.log('Database tables ready');
}).catch(err => {
  console.error('Schema error:', err);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
