import React, { useState } from "react";
import { readContract } from "thirdweb";

export const getDerivedPrice = async (baseAddress, quoteAddress) => {
  try {
    const price = await readContract({
      contract: "0x3998B139FD09CdEB3ec5FdcBB3f98537875a1B89", 
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
