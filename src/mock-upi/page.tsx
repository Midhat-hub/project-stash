"use client";

import { useState, useEffect } from "react";

export default function MockUPI() {
  const [balance, setBalance] = useState(10000); // starting balance ₹10,000
  const [amount, setAmount] = useState("");
  const [sender, setSender] = useState("Alice");
  const [receiver, setReceiver] = useState("You");
  const [status, setStatus] = useState("");
  const [lowBalance, setLowBalance] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(balance); // for animation
  useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();

      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  }

  fetchData();
}, []);


  // Watch balance for low balance warning
  useEffect(() => {
    if (balance < 1000) {
      setLowBalance(true);
    } else {
      setLowBalance(false);
    }
  }, [balance]);

  // Animate balance decreasing
  useEffect(() => {
    let animationFrame: number;
    function animate() {
      if (displayBalance > balance) {
        setDisplayBalance((prev) =>
          prev - Math.max((prev - balance) / 5, 1) // smooth step
        );
        animationFrame = requestAnimationFrame(animate);
      }
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [balance]);

  async function handleSend() {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if (amt > balance) {
      alert("❌ Cannot send more than your balance!");
      return;
    }
console.log("Sending payload:", { amount: amt, sender, receiver });
    // Send transaction to backend
    const response = await fetch("/api/stream", {
      method: "POST",
      body: JSON.stringify({
        amount: amt,
        sender,
        receiver,
      }),
    });

    if (response.ok) {
      setBalance(balance - amt); // triggers animation
      setStatus(`✅ Transaction Sent! Remaining Balance: ₹${balance - amt}`);
      setAmount("");
      setTimeout(() => setStatus(""), 3000);
    } else {
      setStatus("❌ Transaction failed");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Mock UPI Interface 💸</h1>

      {/* Balance Display with animation */}
      <div
        className={`text-xl font-semibold p-3 rounded-lg w-full text-center ${
          lowBalance ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-900"
        }`}
      >
        Balance: ₹{Math.floor(displayBalance)}
        {lowBalance && <span> ⚠ Low Balance!</span>}
      </div>

      {/* Amount input */}
      <input
        type="number"
        placeholder="Enter amount"
        className="border p-2 w-full"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Sender & Receiver */}
      <input
        type="text"
        placeholder="Sender"
        className="border p-2 w-full"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
      />
      <input
        type="text"
        placeholder="Receiver"
        className="border p-2 w-full"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={Number(amount) > balance || Number(amount) <= 0}
        className={`w-full px-4 py-2 rounded-md text-white mt-2 ${
          Number(amount) > balance || Number(amount) <= 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        Send Money
      </button>

      {/* Status */}
      {status && <div className="mt-2 text-center text-lg text-green-700">{status}</div>}
    </div>
  );
}

function setTransactions(transactions: any) {
  throw new Error("Function not implemented.");
}

