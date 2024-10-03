import React, { createContext, useState, useEffect } from 'react';

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask to connect your wallet.');
    }
  };

  const checkConnectedAccount = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    }
  };

  useEffect(() => {
    checkConnectedAccount();
  }, []);

  return (
    <AccountContext.Provider value={{ account, connectWallet }}>
      {children}
    </AccountContext.Provider>
  );
};
