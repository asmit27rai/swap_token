import { FaWallet } from 'react-icons/fa';
import { useContext } from 'react';
import { AccountContext } from '../AccountContext';

const Navbar = () => {
  const { account, connectWallet } = useContext(AccountContext);

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <a href="/" className="flex items-center text-white font-bold space-x-2">
          <img src="/logo.svg" alt="TokenExchange" className="w-8 h-8" />
          <span className="text-xl md:text-2xl sm:text-lg">Exchanger</span>
        </a>

        {account ? (
          <div
            className="flex items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
          >
            <FaWallet className="mr-2 text-sm md:text-xl" />
            <span className="text-sm md:text-base truncate">{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</span>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
          >
            <FaWallet className="mr-2 text-sm md:text-xl" />
            <span className="text-sm md:text-base">Connect Wallet</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
