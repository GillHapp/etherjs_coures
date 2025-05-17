"use client"; // This MUST be the first line

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi, contractAddress } from "./constant";



export default function Home() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      // const provider2 = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      // const provider3 = new ethers.JsonRpcApiProvider("https://sepolia.infura.io/v3/2de477c3b1b74816ae5475da6d289208")
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        // get the chainid in number format
        const chainIdNumber = parseInt(chainId, 16);
        console.log("Connected to chain ID:", chainIdNumber);
        console.log("Connected to account:", accounts[0]);
        console.log("contract:", contract);
        setProvider(provider);
        setAccount(accounts[0]);
      } catch (err) {
        console.error("User rejected connection", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Hello in frontend</h1>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </main>
  );
}
