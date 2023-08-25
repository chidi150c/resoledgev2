import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Scatter, Line } from 'react-chartjs-2'; // Keep the import of 'Line'
import { connectWebSocket } from './websocket'; // Your WebSocket utility

const RealTimeChart = () => {
  const dispatch = useDispatch();
  const tradingData = useSelector(state => state.tradingData);

  useEffect(() => {
    const socket = connectWebSocket(); // Establish WebSocket connection

    socket.onmessage = event => {
      const newTradingPoint = JSON.parse(event.data);
      dispatch({ type: 'ADD_TRADING_POINT', payload: newTradingPoint });
    };

    return () => {
      socket.close(); // Close WebSocket connection when component unmounts
    };
  }, [dispatch]);

  // Extract data for the chart
  const tradingPoints = tradingData.map(point => ({
    timestamp: point.timestamp,
    tickerPrice: point.tickerPrice,
    signal: point.signal,
  }));

  const tickerPriceData = tradingPoints.map(point => ({ x: point.timestamp, y: point.tickerPrice }));

  // Define chartData using all tradingPoints and tickerPriceData
  const chartData = {
    datasets: [
      {
        label: 'Trading Signals',
        data: tradingPoints.map(point => ({ x: point.timestamp, y: point.tickerPrice })),
        borderColor: 'purple',   // Color for the scatter points
        backgroundColor: 'purple', // Color for the scatter points
        showLine: false,        // Hide line connecting points
        pointRadius: 5,         // Adjust the point size
        pointHoverRadius: 7,    // Adjust the point size on hover
      },
      {
        label: 'ticker Price',
        data: tickerPriceData,
        borderColor: 'blue',     // Color for the ticker price line
        fill: false,             // Do not fill the area under the line
      },
    ],
  };

  const chartOptions = {
    // Customize chart options as needed
  };

  return (
    <div>
      <h2>Real-Time Trading Signals and ticker Price</h2>
      <Scatter data={chartData} options={chartOptions} />
    </div>
  );
};

export default RealTimeChart;
