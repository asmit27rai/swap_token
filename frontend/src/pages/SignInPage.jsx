import { SignInButton } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">

      <div className="text-center space-y-8 p-4 md:p-8">
        <img 
          src="/logo.svg" 
          alt="Cross-Chain Token Exchange" 
          className="w-32 h-32 md:w-40 md:h-40 mx-auto animate-bounce"
        />

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight animate-pulse text-white">
          Welcome to Cross-Chain Token Exchange
        </h1>

        <p className="text-md md:text-lg text-gray-300">
          Seamlessly exchange tokens between multiple blockchains.
        </p>
        <p className="text-sm md:text-md text-gray-400">
          Powering chain-to-chain and cross-chain token transfers with speed and security.
        </p>

        <button
          type="button"
          className="py-3 px-8 text-lg md:text-xl font-semibold rounded-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <SignInButton />
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
