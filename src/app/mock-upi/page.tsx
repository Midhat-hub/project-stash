// src/app/mock-upi/page.tsx
"use client";

import { useEffect, useState } from "react";

type Tx = {
  id: string;
  amount: number;
  sender: string;
  receiver: string;
  message?: string;
  timestamp: string;
};

export default function MockUPI() {
  const [balance, setBalance] = useState<number>(0);
  const [displayBalance, setDisplayBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [sender, setSender] = useState<string>("Alice");
  const [receiver, setReceiver] = useState<string>("You");
  const [status, setStatus] = useState<string>("");
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [lowBalance, setLowBalance] = useState(false);

  // fetch current state on load
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setBalance(data.balance ?? 0);
      setDisplayBalance(data.balance ?? 0);
      setTransactions(data.transactions ?? []);
    })();
  }, []);

  // animated balance render
  useEffect(() => {
    let raf = 0;
    function animate() {
      setDisplayBalance((prev) => {
        if (prev === balance) return prev;
        const diff = prev - balance;
        const step = Math.max(Math.ceil(diff / 6), 1);
        const next = Math.max(balance, prev - step);
        return next;
      });
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [balance]);

  useEffect(() => {
    setLowBalance(balance < 1000);
  }, [balance]);

  // send transaction
  async function sendTx() {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setStatus("Enter a valid amount");
      return;
    }
    if (amt > balance) {
      setStatus("Insufficient balance");
      return;
    }
    console.log("Sending payload:", { amount: amt, sender, receiver });


  try {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amt * -1,  // Because sending reduces money
        type: "send",      // Required by backend
        sender,
        receiver,
      }),
    });
      const data = await res.json();
      if (res.ok && data.success) {
        setBalance(data.balance);
        setTransactions((t) => [data.transaction, ...t]);
        setAmount("");
        setStatus(`✅ Sent ₹${amt}. Remaining ₹${data.balance}`);
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus(data.message || "Send failed");
      }
    } catch (e) {
      setStatus("Network error");
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-slate-900 text-slate-100">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Mock UPI</h1>

        <div className={`p-4 rounded-lg mb-4 ${lowBalance ? "bg-red-900" : "bg-slate-800"}`}>
          <div className="text-sm text-slate-300">Balance</div>
          <div className="text-3xl font-semibold">₹{Math.floor(displayBalance)}</div>
          {lowBalance && <div className="text-sm text-amber-300 mt-1">⚠ Low Balance</div>}
        </div>

        {/* Inputs */}
        <div className="space-y-2 mb-4">
          <input
            className="w-full p-2 rounded bg-slate-700 text-white"
            placeholder="Enter Sender name"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <input
            className="w-full p-2 rounded bg-slate-700 text-white"
            placeholder="Receiver"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
          <input
            className="w-full p-3 rounded text-2xl text-center bg-slate-800"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button
          onClick={sendTx}
          disabled={Number(amount) <= 0 || Number(amount) > balance}
          className={`w-full py-3 rounded ${Number(amount) <= 0 || Number(amount) > balance ? "bg-slate-600 text-slate-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-black"}`}
        >
          Pay ₹{amount || 0}
        </button>

        {status && <div className="mt-3 text-center text-sm">{status}</div>}

        {/* Recent transactions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
          <div className="space-y-2">
            {transactions.length === 0 && <div className="text-sm text-slate-400">No transactions yet</div>}
            {transactions.map((tx) => (
              <div key={tx.id} className="p-3 bg-slate-800 rounded">
                <div className="flex justify-between">
                  <div className="font-medium">{tx.receiver}</div>
                  <div className={tx.amount > 0 ? "text-green-400" : "text-rose-400"}>
                    {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-1">{new Date(tx.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
