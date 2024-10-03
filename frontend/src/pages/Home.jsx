import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Swaping from "../components/Swaping";
import { UserButton } from "@clerk/clerk-react";
import Graph from "../components/Graph";
import { AccountContext } from "../AccountContext";

const Home = () => {
  const { account, connectWallet } = useContext(AccountContext);

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-500 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-6">
        {account ? (
          <>
            <div className="flex-1 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
              <Graph />
            </div>
            <div className="flex-1 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
              <Swaping />
            </div>
          </>
        ) : (
          <div className="flex-1 rounded-lg shadow-xl p-8 text-center text-gray-800 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <h2 className="text-3xl font-extrabold text-white mb-6 tracking-wider">
              Connect to MetaMask
            </h2>
            <p className="text-lg text-white mb-6">
              Please connect your MetaMask wallet to access the features.
            </p>
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
      <div className="fixed bottom-4 left-4 z-10">
        <UserButton />
      </div>
    </div>
  );
};

export default Home;
