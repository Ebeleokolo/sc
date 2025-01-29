import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi.json"; 

const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const userProvider = new ethers.BrowserProvider(window.ethereum);
      const userSigner = await userProvider.getSigner();
      const userContract = new ethers.Contract(contractAddress, abi, userSigner);

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setProvider(userProvider);
      setContract(userContract);
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Get the balance from the contract
  const getBalance = async () => {
    if (contract) {
      const contractBalance = await contract.getBalance();
      setBalance(ethers.formatEther(contractBalance));
    }
  };

  // Deposit ETH to the contract
  const deposit = async () => {
    if (contract && amount) {
      const tx = await contract.deposit({ value: ethers.parseEther(amount) });
      await tx.wait();
      setAmount("");
      getBalance();
    }
  };

  // Withdraw ETH from the contract
  const withdraw = async () => {
    if (contract && amount) {
      const tx = await contract.withdraw(ethers.parseEther(amount));
      await tx.wait();
      setAmount("");
      getBalance();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mini DApp</h1>

      {!account ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p className="mb-4">Connected Account: {account}</p>
          <p className="mb-4">Contract Balance: {balance} ETH</p>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter amount (ETH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-2 py-1 border rounded mr-2"
            />

            <button
              onClick={deposit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
            >
              Deposit
            </button>

            <button
              onClick={withdraw}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Withdraw
            </button>
          </div>

          <button
            onClick={getBalance}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Refresh Balance
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
