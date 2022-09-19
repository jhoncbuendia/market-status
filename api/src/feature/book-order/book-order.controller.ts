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
}

export default BookOrderController;
