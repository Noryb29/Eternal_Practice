import { Router } from 'express';
import {
  listStories,
  getStory,
  createStory,
  addChapter,
  deleteStory,
} from '../controllers/storyControllers.js';

const storyRouter = Router();

storyRouter.get('/', listStories);
storyRouter.post('/', createStory);
storyRouter.get('/:id', getStory);
storyRouter.post('/:id/chapters', addChapter);
storyRouter.delete('/:id', deleteStory);

export default storyRouter;
