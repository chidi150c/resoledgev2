import React, { useState, useEffect } from 'react';
import { connectWebSocket } from './websocket';
import { Scatter } from 'react-chartjs-2'; // Import Scatter from react-chartjs-2
import { Chart } from 'chart.js'; // Import Chart from chart.js library
import { LinearScale } from 'chart.js'; // Import LinearScale from chart.js

Chart.register(LinearScale); // Register the LinearScale globally

const RealTimeChart = () => {
  const [tradingData, setTradingData] = useState([]);

  useEffect(() => {
    const socket = connectWebSocket();

    socket.onmessage = event => {
      const newTradingPoint = JSON.parse(event.data);
      setTradingData(prevData => [...prevData, newTradingPoint]);
    };

    return () => {
      socket.close();
    };
  }, []);

  // Extract data for the chart
  const tradingPoints = tradingData.map(point => ({
    timestamp: point.timestamp,
    tickerPrice: point.tickerPrice,
    signal: point.signal,
  }));

  const signalsData = tradingPoints.map(point => ({
    x: point.timestamp,
    y: point.tickerPrice,
    signal: point.signal,
  }));

  // Define chartData for signals and ticker price
  const signalsChartData = {
    datasets: [
      {
        label: 'Signals',
        data: signalsData,
        backgroundColor: 'red', // Color for the signal points
        pointRadius: 10, // Adjust the point size
        pointHoverRadius: 12, // Adjust the point size on hover
        showLine: false, // Hide line connecting points
        pointStyle: function(context) {
          const signal = context.dataset.data[context.dataIndex].signal;
          return signal === 'Buy' ? 'triangle' : signal === 'Sell' ? 'rect' : 'circle';
        },
      },
      {
        label: 'Ticker Price',
        data: tradingPoints.map(point => ({ x: point.timestamp, y: point.tickerPrice })),
        borderColor: 'blue', // Color for the ticker price line
        fill: false, // Do not fill the area under the line
      },
    ],
  };

  const chartOptions = {
    // Customize chart options as needed
  };

  return (
    <div>
      <h2>Real-Time Trading Signals and Ticker Price</h2>
      <Scatter data={signalsChartData} options={chartOptions} />
    </div>
  );
};

export default RealTimeChart;
