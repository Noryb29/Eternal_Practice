import { Router } from 'express';
import {
  listLocations,
  createLocation,
  deleteLocation,
} from '../controllers/locationControllers.js';

const locationRouter = Router();

locationRouter.get('/', listLocations);
locationRouter.post('/', createLocation);
locationRouter.delete('/:id', deleteLocation);

export default locationRouter;
