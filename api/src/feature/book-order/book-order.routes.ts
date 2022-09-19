import { Router } from 'express';
import BookOrderController from './book-order.controller';

const bookOrderRouter = Router();

bookOrderRouter.get(
  '/book/order/tips/:pairname',
  async (request, response, next) => {
    await BookOrderController.getTips(request, response, next);
  },
);

bookOrderRouter.get(
  '/book/order/simulate/:pairname/:operationtype/:amount',
  async (request, response, next) => {
    await BookOrderController.simulateOperation(request, response, next);
  },
);

export default bookOrderRouter;
