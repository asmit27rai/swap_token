import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Graph = () => {
  const [allMarketData, setAllMarketData] = useState({});
  const [selectedMarket, setSelectedMarket] = useState("BTCINR");
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.coindcx.com/exchange/ticker");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        const marketData = data.reduce((acc, item) => {
          acc[item.market] = item;
          return acc;
        }, {});
        setAllMarketData(marketData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (allMarketData[selectedMarket]) {
      setGraphData((prevData) => {
        const newData = [
          ...prevData,
          {
            time: new Date().toLocaleTimeString(),
            price: parseFloat(allMarketData[selectedMarket].last_price),
          },
        ];
        return newData.slice(-20); // Limit to the last 20 points
      });
    }
  }, [allMarketData, selectedMarket]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center font-bold text-xl">{error}</div>
    );

  const currentMarketData = allMarketData[selectedMarket];
  const priceChange = parseFloat(currentMarketData?.change_24_hour);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-900 to-indigo-800 rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-white">Live Tracker</h2>
        <select
          className="bg-transparent border-2 border-purple-300 text-purple-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
        >
          {Object.keys(allMarketData).map((market) => (
            <option key={market} value={market} className="bg-indigo-800">
              {market}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#999" opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke="#fff"
                tick={false} // Hide ticks
                label={{
                  value: "Time",
                  position: "insideBottom",
                  fill: "#fff",
                  offset: -5,
                }}
              />
              <YAxis
                stroke="#fff"
                tick={false} // Hide ticks
                label={{
                  value: "Price",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#fff",
                  offset: 5,
                }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(76, 29, 149, 0.8)",
                  border: "none",
                  borderRadius: "5px",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10B981"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-white">
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Current Price</h3>
          <p className="text-xl font-bold">
            {parseFloat(currentMarketData?.last_price).toFixed(3)}
          </p>
          <div
            className={`flex items-center ${
              priceChange >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {priceChange >= 0 ? (
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            )}
            <span>{Math.abs(priceChange)}%</span>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">24h Stats</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-1 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <div>
                <p className="text-sm opacity-70">High</p>
                <p className="font-semibold text-sm">{currentMarketData?.high}</p>
              </div>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-1 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
              <div>
                <p className="text-sm opacity-70">Low</p>
                <p className="font-semibold text-sm">{currentMarketData?.low}</p>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm opacity-70">Volume</p>
              <p className="font-semibold text-sm">
                {parseFloat(currentMarketData?.volume).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;
