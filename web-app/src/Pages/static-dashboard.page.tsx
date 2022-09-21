import React, {useEffect, useState} from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js'
import {Chart, Bar, Line} from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
)

export default function StaticDashboardPage() {
  const [tips, setTips]: any = useState();
  const [ordersData, setOrdersData]: any = useState(false);
  const [simulateOperationData, setSimulateOperationData]: any = useState(false);

  const fetchBookOrderData = async () => {
    const response = await axios.get('http://localhost:3000/book/order/tips/tBTCUSD');
    setTips(response.data);
    const {orderBookItems} = response.data;

    if (orderBookItems) {
      setOrdersData(
        {
          labels: orderBookItems.map((order: any) => order.period),
          datasets: [
            {
              barPercentage: 1,
              categoryPercentage: 1,
              label: 'Price (USD)',
              backgroundColor: orderBookItems.map((order: any) => order.period > 0 ? 'green' : 'rgb(255, 99, 132)'),
              data: orderBookItems.map((order: any) => order.price),
              fill: false,
              tension: 0.1
            },
          ],
        }
      );
    }
  }
  const fetchSimulateOperationData = async () => {
    const response = await axios.get('http://localhost:3000/book/order/simulate/tBTCUSD/sell/10');
    console.log(response.data);
    setSimulateOperationData(response.data);
  }

  useEffect(() => {
    fetchBookOrderData();
    fetchSimulateOperationData();
    return () => {
    }
  }, []);

  if (!(simulateOperationData || tips)) return (<div>Loading</div>)
  return (
    <div>
      {simulateOperationData &&
          <div>
              <h1>Simulate Operation</h1>
              <p>{`Pair Name: ${simulateOperationData.pairName}, Operation Type: ${simulateOperationData.operationType}`}</p>
              <p>{`Amount: ${simulateOperationData.amount}, Effective Price: ${simulateOperationData.effectivePrice}`}</p>
          </div>
      }

      {tips &&
          <div>
              <h1>DashBoard</h1>
              <h2>Pair Name: {tips.pairName}</h2>
              <h2>Ask Tip</h2>
              <p>Highest
                  Price: {`: ${tips.highestAsk.price} USD, rate: ${tips.highestAsk.rate}, period: ${tips.highestAsk.period}`} </p>
              <p>Lowest
                  Price: {`: ${tips.lowestAsk.price} USD, rate: ${tips.lowestAsk.rate}, period: ${tips.lowestAsk.period}`} </p>
              <h2>Bid Tip</h2>
              <p>Highest
                  Price: {`: ${tips.highestBid.price} USD, rate: ${tips.highestBid.rate}, period: ${tips.highestBid.period}`} </p>
              <p>Lowest
                  Price: {`: ${tips.lowestBid.price} USD, rate: ${tips.lowestBid.rate}, period: ${tips.lowestBid.period}`} </p>
              <h2>Spread</h2>
              <p>{tips && tips.spreadPrice} USD </p>
          </div>
      }

      {
        ordersData && <Line data={ordersData}/>
      }

    </div>
  );
}