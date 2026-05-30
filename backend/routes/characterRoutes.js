import { Router } from 'express';
import {
  listCharacters,
  createCharacter,
  deleteCharacter,
} from '../controllers/characterControllers.js';

const characterRouters = Router();

characterRouters.get('/', listCharacters);
characterRouters.post('/', createCharacter);
characterRouters.delete('/:id', deleteCharacter);

export default characterRouters;
