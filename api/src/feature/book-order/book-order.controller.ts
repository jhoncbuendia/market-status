import BookOrderService from './book-order.service';

class BookOrderController {
  static async getTips(request: any, response: any, next: any) : Promise<void> {
    try {
      const tips = await BookOrderService.getTips(request.params.pairname);
      response.json(tips);
    } catch (error) {
      next(error);
    }
  }

  static async simulateOperation(request: any, response: any, next: any) : Promise<void> {
    try {
      const { pairname, operationtype, amount } = request.params;
      const tips = await BookOrderService.simulateOperation(pairname, operationtype, amount);
      response.json(tips);
    } catch (error) {
      next(error);
    }
  }
}

export default BookOrderController;
