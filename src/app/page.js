"use client"; // This MUST be the first line

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi, contractAddress } from "./constant";



export default function Home() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [events, setEvents] = useState([]);


  useEffect(() => {
    const fetchPastEventsAndListen = async () => {
      if (!account || !provider) return;

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // 1️⃣ Fetch past UserRegistered events
      try {
        const filter = contract.filters.UserRegistered("0x78c36eD4B3cB79Cb78b187fDAF178DF0C36e5016"); // no args = all users
        const events = await contract.queryFilter(filter, 0, "latest");

        console.log("📦 Past Events:");
        events.forEach((event) => {
          const { user, name, age } = event.args;
          console.log("🕓", user, name, age.toString());
          setEvents((prev) => [
            ...prev,
            `User: ${user}, Name: ${name}, Age: ${age.toString()}`
          ]);
        });
      } catch (err) {
        console.error("❌ Error fetching past events:", err);
      }

      // 2️⃣ Live listener
      contract.removeAllListeners("UserRegistered");

      contract.on("UserRegistered", (user, name, age) => {
        console.log("📢 New UserRegistered event:", user, name, age.toString());
        setEvents((prev) => [
          ...prev,
          `User: ${user}, Name: ${name}, Age: ${age.toString()}`
        ]);
      });

      console.log("🎧 Event listener added for UserRegistered");
    };

    fetchPastEventsAndListen();
  }, [account, provider]);
  // re-run only when account/provider changes



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

  // register user 

  const registerUser = async () => {

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const tx = await contract.registerUser(name, parseInt(age));
      await tx.wait();
      console.log("Transaction hash:", tx.hash);
      console.log("User registered:", name, age);
      const event = tx.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter((parsed) => parsed && parsed.name === "UserRegistered")[0];

      if (event) {
        const { user, name, age } = event.args;
        console.log("🟢 Event Emitted:");
        console.log("User:", user);
        console.log("Name:", name);
        console.log("Age:", age.toString());
      } else {
        console.log("❌ No UserRegistered event found in logs.");
      }
    }
    catch (err) {
      console.error("Error registering user:", err);
    }


  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Hello in frontend</h1>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button onClick={registerUser}>Register</button>
      </div>
    </main>
  );
}
