# Exchanger

This repository contains a decentralized application (DApp) that allows users to track real-time market prices of tokens and perform token exchanges. The application utilizes smart contracts deployed on Thirdweb and integrates with Chainlink for cross-chain interoperability.

## Link
https://tokenswap-one.vercel.app/

## Project Structure

The project consists of three main folders:

- **Frontend**: Contains the user interface with real-time market price graphs and token exchange functionality.
- **Backend**: Contains the smart contract for token exchange using Chainlink's Cross-Chain Interoperability Protocol (CCIP).
- **Backend_price**: Contains the smart contract for fetching token prices using Chainlink.

## Overview

### 1. Frontend
The **Frontend** folder includes:
- A graphical representation of real-time market prices of tokens using the [CoinDCX API](https://coindcx.com/).
- A token exchange interface powered by a smart contract deployed on [Thirdweb](https://thirdweb.com/).

### 2. Backend
The **Backend** folder includes:
- A smart contract deployed on Thirdweb that facilitates token exchanges across different blockchains using Chainlink's CCIP.

### 3. Backend_price
The **Backend_price** folder includes:
- A smart contract deployed on Thirdweb that retrieves token prices using Chainlink, ensuring accurate pricing information.

## Getting Started

To get started with this project, follow the instructions below:

### Prerequisites

- Node.js
- npm

### Installation

Clone this repository:
   ```bash
   git clone https://github.com/yourusername/repo-name.git
   cd repo-name
   cd Frontend
   npm install
   npm run dev
