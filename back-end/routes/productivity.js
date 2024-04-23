import express from 'express';
import * as productivityController from '../controllers/productivity.js';

export const productivityRouter = express.Router();

productivityRouter.get('/productivity/:userId', productivityController.getProductivity);
productivityRouter.put('/productivity/:userId', productivityController.updateProductivity);
productivityRouter.put('/productivity/reset/:userId', productivityController.resetProductivity);
