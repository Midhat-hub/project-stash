"use client";

import { useState } from "react";

export default function SendMoneyPage() {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const numbers = ["1","2","3","4","5","6","7","8","9","0"];

  async function sendPayment() {
    if (!amount || !name) return alert("Enter recipient & amount");

    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), to: name })
    });

    const data = await res.json();
    setStatus("✅ Payment Sent: ₹" + amount);
    setAmount("");
    setTimeout(() => setStatus(""), 3000);
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">

      {/* Avatar + Name Input */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-purple-500 text-white flex items-center justify-center text-3xl">
          {name ? name[0].toUpperCase() : "?"}
        </div>
        <input
          className="mt-3 px-3 py-2 border rounded w-48 text-center"
          placeholder="Enter recipient name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Amount Display */}
      <div className="text-5xl font-bold">₹{amount || "0"}</div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => setAmount(amount + num)}
            className="text-2xl font-semibold bg-gray-200 w-20 h-20 rounded-full active:scale-95 transition"
          >
            {num}
          </button>
        ))}

        {/* Clear */}
        <button
          onClick={() => setAmount(amount.slice(0, -1))}
          className="text-xl bg-red-200 w-20 h-20 rounded-full"
        >
          ⌫
        </button>
      </div>

      {/* Pay Button */}
      <button
        onClick={sendPayment}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg text-xl active:scale-95 transition"
      >
        Pay ₹{amount || 0}
      </button>

      {/* Status */}
      {status && (
        <div className="mt-4 text-green-700 font-semibold bg-green-100 p-3 rounded-lg">
          {status}
        </div>
      )}
    </div>
  );
}
