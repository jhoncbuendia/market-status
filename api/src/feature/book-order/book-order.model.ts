export type OrderModel = {
  price: number;
  rate: number;
  period: number;
}

export type OrderBookModel = {
  pairName: string
  lowestAsk: OrderModel
  highestAsk: OrderModel
  lowestBid: OrderModel
  highestBid: OrderModel
  spreadPrice: number
  spreadPeriod: number
  askOrders: Array<OrderModel>
  bidOrders: Array<OrderModel>
  orderBookItems: Array<OrderModel>
  totalOrders: number
}
