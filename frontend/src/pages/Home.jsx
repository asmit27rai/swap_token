import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Swaping from '../components/Swaping';
import { UserButton } from '@clerk/clerk-react';
import Graph from '../components/Graph';
import { AccountContext } from '../AccountContext';

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
          <div className="flex-1 rounded-lg shadow-lg p-6text-center text-gray-800">
            <h2 className="text-2xl font-bold mb-4">Connect to MetaMask</h2>
            <p className="mb-4">Please connect your MetaMask wallet to access the features.</p>
            <button
              onClick={connectWallet}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
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
