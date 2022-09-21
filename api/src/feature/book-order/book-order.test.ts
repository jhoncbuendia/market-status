// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import BookOrderService from './book-order.service';

jest.mock('axios');
jest.mock('lodash', () => ({
  // eslint-disable-next-line no-unused-vars
  filter: (collection: any, ...args: any) => collection[0],
  // eslint-disable-next-line no-unused-vars
  orderBy: (collection: any, ...args: any) => collection,
  // eslint-disable-next-line no-unused-vars
  minBy: (collection: any, ...args: any) => collection,
  // eslint-disable-next-line no-unused-vars
  maxBy: (collection: any, ...args: any) => collection,
  // eslint-disable-next-line no-unused-vars
  sortBy: (collection: any, ...args: any) => collection,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue({
  data: [
    [18931, 3, 15.73006556],
    [18930, 5, 30.73503277],
    [18929, 2, 0.310324],
    [18928, 4, 0.95403201],
    [18927, 3, 1.93289],
    [18926, 4, 1.66765233],
    [18925, 8, 4.90466496],
    [18924, 5, 0.78721752],
    [18923, 2, 0.17919],
    [18922, 4, 0.228757],
    [18921, 6, 1.50516055],
    [18920, 6, 0.95713989],
    [18919, 4, 0.04504],
    [18918, 8, 3.64234811],
    [18917, 7, 0.81503796],
    [18916, 5, 0.44585709],
    [18915, 1, 0.08394278],
    [18914, 4, 3.5658577],
    [18913, 2, 2.65402459],
    [18912, 3, 0.13904788],
    [18911, 1, 0.001],
    [18910, 4, 2.22552476],
    [18908, 4, 0.31238148],
  ],
});
const MOCKED_TIPS_RESPONSE = {
  pairName: 'tBTCUSD',
  lowestAsk: {price: 18931, rate: 3, period: 15.73006556},
  highestAsk: {price: 18931, rate: 3, period: 15.73006556},
  lowestBid: {price: 18931, rate: 3, period: 15.73006556},
  highestBid: {price: 18931, rate: 3, period: 15.73006556},
  spreadPrice: 18931,
  spreadPeriod: 15.73006556,
  askOrders: {price: 18931, rate: 3, period: 15.73006556},
  bidOrders: {price: 18931, rate: 3, period: 15.73006556},
  orderBookItems: [
    {price: 18931, rate: 3, period: 15.73006556},
    {price: 18930, rate: 5, period: 30.73503277},
    {price: 18929, rate: 2, period: 0.310324},
    {price: 18928, rate: 4, period: 0.95403201},
    {price: 18927, rate: 3, period: 1.93289},
    {price: 18926, rate: 4, period: 1.66765233},
    {price: 18925, rate: 8, period: 4.90466496},
    {price: 18924, rate: 5, period: 0.78721752},
    {price: 18923, rate: 2, period: 0.17919},
    {price: 18922, rate: 4, period: 0.228757},
    {price: 18921, rate: 6, period: 1.50516055},
    {price: 18920, rate: 6, period: 0.95713989},
    {price: 18919, rate: 4, period: 0.04504},
    {price: 18918, rate: 8, period: 3.64234811},
    {price: 18917, rate: 7, period: 0.81503796},
    {price: 18916, rate: 5, period: 0.44585709},
    {price: 18915, rate: 1, period: 0.08394278},
    {price: 18914, rate: 4, period: 3.5658577},
    {price: 18913, rate: 2, period: 2.65402459},
    {price: 18912, rate: 3, period: 0.13904788},
    {price: 18911, rate: 1, period: 0.001},
    {price: 18910, rate: 4, period: 2.22552476},
    {price: 18908, rate: 4, period: 0.31238148},
  ],
  totalOrders: 23,
};

describe('Book order service', () => {
  it('should return tips for tBTCUSD pair name', async () => {
    const tips = await BookOrderService.getTips('tBTCUSD');
    expect(tips).toEqual(MOCKED_TIPS_RESPONSE);
    expect(axios.get).toHaveBeenCalledWith('https://api-pub.bitfinex.com/v2/book/tBTCUSD/P0');
  });

  it('should thrown an error when using an invalid pair name', async () => {
    try {
      await BookOrderService.getTips('INVALID_PAIR');
      expect(axios.get).toHaveBeenCalledWith('https://api-pub.bitfinex.com/v2/book/tBTCUSD/P0');
    } catch (e) {
      expect(e.message).toEqual('INVALID_PAIR pair value is not allowed');
    }
  });
});
