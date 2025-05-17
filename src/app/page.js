"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
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
