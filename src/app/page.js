"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Home() {
  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        const rawBalance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(rawBalance));
      } catch (err) {
        console.error("Connection error:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        // Network info
        const network = await provider.getNetwork();
        setChainId(network.chainId);
        setNetworkName(network.name);

        // Latest block
        const block = await provider.getBlock("latest");
        setBlockNumber(block.number);
        setTimestamp(new Date(block.timestamp * 1000).toLocaleString());
      } catch (err) {
        console.error("Error fetching blockchain data", err);
      }
    };

    fetchBlockchainData();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>🔗 Blockchain Info (Sepolia)</h1>

      <p><strong>Chain ID:</strong> {chainId ?? "Loading..."}</p>
      <p><strong>Network Name:</strong> {networkName ?? "Loading..."}</p>
      <p><strong>Block Number:</strong> {blockNumber ?? "Loading..."}</p>
      <p><strong>Block Timestamp:</strong> {timestamp ?? "Loading..."}</p>
      <hr />

      {account ? (
        <>
          <p><strong>Connected Account:</strong> {account}</p>
          <p><strong>ETH Balance:</strong> {balance ?? "Loading..."} ETH</p>
        </>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
}
