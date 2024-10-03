require("dotenv").config({});
import Web3 from "web3";

const HTTP_URL = process.env.VITE_HTTP_URL;
const WSS_URL = process.env.VITE_WSS_URL;

const web3http = new Web3(HTTP_URL);
const web3ws = new Web3(WSS_URL);

module.exports = { web3http, web3ws };