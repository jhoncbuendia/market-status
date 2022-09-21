import React, {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";
import ApexCharts from 'apexcharts'
import _ from "lodash";

type BidOrders = {
  rate: Array<any>
  sequence: Array<any>
  data: Array<any>
}

export default function DynamicDashboardPage() {

  var options = {
    chart: {
      height: 350,
      type: 'line',
      //stacked: true,
      dataLabels: {
        enabled: true,
      },
      animations: {
        enabled: false,
        easing: 'linear',
        dynamicAnimation: {
          speed: 2000
        }
      },
    },
    stroke: {
      curve: 'stepline',
    },
    markers: {
      hover: {
        sizeOffset: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    series: [{
      name: 'Ask',
      data: []
    }],
    xaxis: {
      type: 'datetime',
    },
  }

  function initializeSocket(chart: any) {
    console.log('connecting to web socket');
    const socket = io("http://localhost:4000",
      {
        query: {
          "my-key": "my-value"
        }
      });
    let bidOrders: BidOrders = {
      rate: [],
      sequence: [],
      data: []
    }

    const updateChartThrottle = _.throttle((data) => {
      console.log('updateChart', data);
      chart.updateSeries([{
        data
      }])
    }, 2000);

    socket.on("connect", () => {
      console.log('socket connected', socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("error", (error) => {
      console.log('error', error);
    });

    socket.on("onReceiveNewOrder", ({askDeltas, bidDeltas, depth, marketSymbol, sequence}: any) => {
      //console.log('onReceiveNewOrder', {askDeltas, bidDeltas, depth, marketSymbol, sequence});

      if (askDeltas.length > 0) {
        // console.log('askDeltas received', askDeltas);

        askDeltas.forEach((order: any, index: any) => {
          bidOrders.rate.push(order.rate);
          bidOrders.sequence.push(sequence);
          bidOrders.data.push([new Date().getTime(), order.rate]);
          if (bidOrders.data.length > 100) {
            let half = Math.ceil(bidOrders.data.length / 2);
            bidOrders.data = bidOrders.data.slice(half);
          }
          updateChartThrottle(bidOrders.data);
        });
      }

      // if (bidOrders.data.length > 9) {
      //   socket.disconnect()
      //   console.log('disconnected');
      //   setTimeout(() => {
      //     socket.connect();
      //     console.log('connected')
      //   }, 2000);
      // }
    });

  }


  useEffect(() => {
    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
    initializeSocket(chart);
  }, []);

  return (
    <div>
      {
        <div id="chart">Graph</div>
      }
    </div>
  )
}