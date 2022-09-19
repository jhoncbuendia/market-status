import Axios from 'axios';
import _ from 'lodash';
import { OrderModel, OrderBookModel } from './book-order.model';

const baseUrl = 'https://api-pub.bitfinex.com/v2'; // Domain
const AllowedPairs = ['tBTCUSD', 'tETHUSD'];

class BookOrderService {
  static async getTips(pairName: string): Promise<OrderBookModel> {
    try {
      if (_.find(AllowedPairs, pairName)) { throw Error('Pair value is not allowed'); }
      const result = await Axios.get(`${baseUrl}/book/${pairName}/P0`);
      const { data } = result;

      let orderBookItems: Array<OrderModel> = data.map((item: any) => ({
        price: item[0],
        rate: item[1],
        period: item[2],
      }));

      let askOrders: Array<OrderModel> = _.filter(orderBookItems, (item) => item.period < 0);
      askOrders = _.orderBy(askOrders, 'period', ['asc', 'desc']);

      const lowestAsk: OrderModel = _.minBy(askOrders, 'price');
      const highestAsk: OrderModel = _.maxBy(askOrders, 'price');

      let bidOrders: Array<OrderModel> = _.filter(orderBookItems, (item) => item.period > 0);
      bidOrders = _.orderBy(bidOrders, 'period', ['asc', 'desc']);

      const lowestBid: OrderModel = _.minBy(bidOrders, 'price');
      const highestBid: OrderModel = _.maxBy(bidOrders, 'price');

      orderBookItems = _.sortBy(orderBookItems, 'rate');
      orderBookItems = _.sortBy(orderBookItems, 'period');

      const spreadPrice: number = (lowestAsk.price + highestBid.price) / 2;
      const spreadPeriod: number = (lowestAsk.period + highestBid.period) / 2;

      return {
        pairName,
        lowestAsk,
        highestAsk,
        lowestBid,
        highestBid,
        spreadPrice,
        spreadPeriod,
        askOrders,
        bidOrders,
        orderBookItems,
        totalOrders: orderBookItems.length,
      } as OrderBookModel;
    } catch (err) {
      throw err;
    }
  }

  static async simulateOperation(pairName: string, operationType: string, amount: number) {
    try {
      const operation = _.toLower(operationType);
      if (!(operation === 'buy' || operation === 'sell')) throw Error('Operation not allowed');
      const orderBook: OrderBookModel = await this.getTips(pairName);
      const {spreadPrice} = orderBook;
      let effectivePrice = 0;
      if (operation === 'buy') effectivePrice = orderBook.lowestAsk.price * amount;
      if (operation === 'sell') effectivePrice = orderBook.highestAsk.price * amount;
      return {
        pairName,
        operationType,
        amount,
        spreadPrice,
        effectivePrice,
      };
    } catch (err) {
      throw err;
    }
  }
}

export default BookOrderService;
