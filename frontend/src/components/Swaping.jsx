// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { AccountContext } from '../AccountContext';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale } from 'chart.js';
// import 'chartjs-adapter-date-fns'; 
// import axios from 'axios';
// import { prepareContractCall } from "thirdweb";
// import { useSendTransaction } from "thirdweb/react";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale);

// const Swapping = () => {
//   const { account, connectWallet } = useContext(AccountContext);
//   const { mutate: sendTransaction } = useSendTransaction(); // Hook for sending transactions
//   const [tokens, setTokens] = useState([]);
//   const [fromToken, setFromToken] = useState(null);
//   const [toToken, setToToken] = useState(null);
//   const [amount, setAmount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [priceData, setPriceData] = useState([]);
//   const chartRef = useRef(null);

//   const fetchTokenList = async () => {
//     try {
//       const response = await fetch('https://bridge.arbitrum.io/token-list-42161.json');
//       if (!response.ok) {
//         throw new Error('Failed to fetch token list');
//       }
//       const data = await response.json();
//       setTokens(data.tokens);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPrice = async () => {
//     if (fromToken && toToken && fromToken.name && toToken.name) {
//       try {
//         const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromToken.name},${toToken.name}&vs_currencies=inr`);
//         if (!response.ok) {
//           throw new Error(`Error fetching price data: ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data[fromToken.id] && data[toToken.id]) {
//           const fromPriceINR = data[fromToken.id].inr;
//           const toPriceINR = data[toToken.id].inr;
//           const exchangeRate = fromPriceINR / toPriceINR;
//           const timestamp = new Date();

//           setPriceData(prevData => [...prevData, { timestamp, price: exchangeRate }].slice(-50));
//         } else {
//           console.error('One or both tokens are missing price data');
//         }
//       } catch (err) {
//         console.error('Error fetching price data:', err);
//       }
//     }
//   };   

//   useEffect(() => {
//     fetchTokenList();
//   }, []);

//   useEffect(() => {
//     if (fromToken && toToken) {
//       fetchPrice();
//       const interval = setInterval(fetchPrice, 2000);
//       return () => clearInterval(interval);
//     }
//   }, [fromToken, toToken]);

//   const handleSwap = () => {
//     if (!fromToken || !toToken || !amount) {
//       console.error('Please select both tokens and enter an amount');
//       return;
//     }

//     const transaction = prepareContractCall({
//       contract: fromToken.contractAddress, // Contract address of the token
//       method: "function swapAndTransferTokens(uint64 _destinationChainSelector, address _receiver, address _fromToken, address _toToken, uint256 _fromAmount, uint256 _minToAmount) returns (bytes32 messageId)",
//       params: [1, account, fromToken.address, toToken.address, amount, 0], // Assuming 1 for _destinationChainSelector and minToAmount as 0 for example
//     });

//     sendTransaction(transaction);
//   };

//   const chartOptions = {
//     responsive: true,
//     animation: { duration: 0 },
//     interaction: { mode: 'index', intersect: false },
//     scales: {
//       x: {
//         type: 'time',
//         time: { unit: 'second', tooltipFormat: 'HH:mm:ss', displayFormats: { second: 'HH:mm:ss' } },
//         grid: { display: false },
//         ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 5, color: 'rgba(255, 255, 255, 0.7)' }
//       },
//       y: {
//         beginAtZero: false,
//         grid: { color: 'rgba(255, 255, 255, 0.1)' },
//         ticks: { callback: value => value.toFixed(6), color: 'rgba(255, 255, 255, 0.7)' }
//       },
//     },
//     plugins: {
//       legend: { display: false },
//       title: {
//         display: true, text: 'Token Exchange Rate Over Time', color: 'white',
//         font: { size: 16, weight: 'bold' }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0, 0, 0, 0.7)', titleColor: 'white', bodyColor: 'white',
//         titleFont: { size: 14, weight: 'bold' },
//         bodyFont: { size: 12 },
//         padding: 10, cornerRadius: 4,
//         callbacks: {
//           label: (context) => `Exchange Rate: ${context.parsed.y.toFixed(6)} ${toToken?.symbol}/${fromToken?.symbol}`
//         }
//       }
//     },
//   };

//   const chartData = {
//     labels: priceData.map(d => d.timestamp),
//     datasets: [
//       {
//         label: 'Exchange Rate',
//         data: priceData.map(d => d.price),
//         borderColor: 'rgb(75, 192, 192)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderWidth: 2,
//         pointRadius: 0,
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   return (
//     <div className="w-full max-w-lg mx-auto mt-10 bg-gray-900 p-8 rounded-lg shadow-xl text-white sm:w-11/12 lg:w-1/2">
//       <h1 className="text-3xl font-bold mb-6 text-center">Swap Tokens</h1>

//       <div className="mb-4">
//         <h2 className="text-xl mb-2">From</h2>
//         <select
//           className="w-full bg-gray-800 text-white py-3 pl-5 pr-10 rounded-lg"
//           onChange={(e) => setFromToken(tokens.find(t => t.address === e.target.value))}
//           defaultValue=""
//         >
//           <option value="" disabled>Select From Token</option>
//           {tokens.map(token => (
//             <option key={token.address} value={token.address}>
//               {token.symbol} - {token.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-4">
//         <h2 className="text-xl mb-2">To</h2>
//         <select
//           className="w-full bg-gray-800 text-white py-3 pl-5 pr-10 rounded-lg"
//           onChange={(e) => setToToken(tokens.find(t => t.address === e.target.value))}
//           defaultValue=""
//         >
//           <option value="" disabled>Select To Token</option>
//           {tokens.map(token => (
//             <option key={token.address} value={token.address}>
//               {token.symbol} - {token.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-4">
//         <h2 className="text-xl mb-2">Amount</h2>
//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="w-full bg-gray-800 text-white py-3 pl-5 rounded-lg"
//           placeholder="Enter amount"
//         />
//       </div>

//       <button
//         onClick={handleSwap}
//         className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg w-full"
//       >
//         Swap and Transfer
//       </button>

//       <div className="mt-8">
//         <Line ref={chartRef} data={chartData} options={chartOptions} />
//       </div>
//     </div>
//   );
// };

// export default Swapping;

import React, { useState } from "react";
import { readContract } from "thirdweb";

// Function to get the derived price of a token pair
export const getDerivedPrice = async (baseAddress, quoteAddress) => {
  try {
    const price = await readContract({
      contract: "your-contract-address-here", // Replace with the actual contract address
      method: "getDerivedPrice",
      params: [baseAddress, quoteAddress],
    });

    return price.toString();
  } catch (error) {
    console.error("Error fetching price:", error);
    return "Error fetching price";
  }
};

const tokenList = [
  { name: "APE", address: "0x996684D3B879E4193e4678D2C276F8B000cd533B" },
  { name: "ARB", address: "0x69732985bC99a55A94ceb4462fC4Eeb2125E00F3" },
  { name: "AVAX", address: "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD" },
  { name: "AXS", address: "0x5c92bD486bB9A04a2b6a0CE1B794218a34c941D5" },
  { name: "BAT", address: "0x8fb015BE5ddF8ab5AAE9a74A5eCAa8E5EDF1C359" },
  { name: "BNB", address: "0x5576815a38A3706f37bf815b261cCc7cCA77e975" },
  { name: "BTC", address: "0x31CF013A08c6Ac228C94551d535d5BAfE19c602a" },
  { name: "ETH", address: "0x86d67c3D38D2bCeE722E601025C25a575021c6EA" },
  { name: "DOT", address: "0x3C07402a102647102d03E14582251Cf49D6217B4" },
  { name: "LINK", address: "0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470" },
  { name: "MATIC", address: "0xB0924e98CAFC880ed81F6A4cA63FD61006D1f8A0" },
  { name: "MKR", address: "0x0d79df66BE487753B02D015Fb622DED7f0E9798d" },
  { name: "NEAR", address: "0xf988e4374165a081cd4647a5A9f46F158B10cF3D" },
  { name: "SAND", address: "0x166B620003Bc28243C75c1a98d39f25062C30234" },
  { name: "SNX", address: "0x77F3Afd947Fff9CAe6d1F4282Bade2F66b22aD18" },
  { name: "UNI", address: "0x7b219F57a8e9C7303204Af681e9fA69d17ef626f" },
  { name: "USDC", address: "0x97FE42a7E96640D932bbc0e1580c73E705A8EB73" },
  { name: "USDT", address: "0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad" },
  { name: "ZRX", address: "0xD86A58dAC8eE168D9cedC19d3741Be4811F9B440" },
];

const Swaping = () => {
  const [baseToken, setBaseToken] = useState(tokenList[0].address);
  const [quoteToken, setQuoteToken] = useState(tokenList[1].address);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPrice = async () => {
    setLoading(true);
    const derivedPrice = await getDerivedPrice(baseToken, quoteToken);
    setPrice(derivedPrice);
    setLoading(false);
  };

  const swapTokens = () => {
    const temp = baseToken;
    setBaseToken(quoteToken);
    setQuoteToken(temp);
  };

  return (
    <div className="p-6 w-full max-w-lg mx-auto bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-extrabold text-center text-white">Token Price Checker</h2>

      <div className="space-y-2">
        <label className="block text-gray-100">Select Base Token</label>
        <select
          value={baseToken}
          onChange={(e) => setBaseToken(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {tokenList.map((token) => (
            <option key={token.address} value={token.address}>
              {token.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-100">Select Quote Token</label>
        <select
          value={quoteToken}
          onChange={(e) => setQuoteToken(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {tokenList.map((token) => (
            <option key={token.address} value={token.address}>
              {token.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={swapTokens}
        className="w-full bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-yellow-500 transition duration-300"
      >
        Swap Tokens
      </button>
      <button
        onClick={fetchPrice}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        {loading ? "Fetching Price..." : "Get Price"}
      </button>

      {price && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-lg font-bold text-gray-800">Price:</h3>
          <p className="text-gray-700">{price}</p>
        </div>
      )}
    </div>
  );
};

export default Swaping;
