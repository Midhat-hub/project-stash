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

    // Build transaction payload FOR AI
    const aiTx = {
      sender,
      receiver,
      amount: amt, // AI should receive positive amount
      timestamp: new Date().toISOString(),
    };

    // 1️⃣ Ask AI first (budget check)
    const aiRes = await fetch("/api/transactions/pending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aiTx),
    }).then((r) => r.json());

    let allow = true;

    /* -------------------------------------------------------
         BEFORE PAYMENT ALERT LOGIC
         Show alert ONLY IF:
         - amount > 100, AND
         - AI decision is NOT "allow"
    ----------------------------------------------------------*/
    const shouldWarn = amt > 100 && aiRes.decision !== "allow";

    if (shouldWarn) {
      allow = window.confirm(
        `⚠️ Budget Alert:\n\n${aiRes.nudges.join(
          "\n"
        )}\n\nDo you still want to proceed?`
      );
    }

    if (!allow) {
      setStatus("❌ Payment cancelled.");
      return;
    }

    // 2️⃣ Make actual request (YOUR subtraction logic stays)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt * -1, // KEEPING YOUR LOGIC
          type: "send",
          sender,
          receiver,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
  setBalance(data.balance);
  setTransactions((t) => [data.transaction, ...t]);
  setAmount("");

  // AFTER PAYMENT AI INSIGHTS
  const postAI = await fetch("/api/transactions/after", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender,
      receiver,
      amount: amt,
      timestamp: new Date().toISOString()
    }),
  }).then(r => r.json());

  let msg =
    `✓ Payment Successful\n\n` +
    `Amount: ₹${amt}\n` +
    `Remaining Balance: ₹${data.balance}\n\n` +
    `Category: ${postAI.category}\n\n` +
    `${postAI.insights.join("\n")}`;

  // 🔥 AFTER PAYMENT ALERT (guaranteed to work)
  alert(msg);

} else {
  alert("Payment failed. Please try again.");
}

    } catch (e) {
      setStatus("Network error");
    }
  }


return (
        <div className="min-h-screen flex justify-center bg-gray-50 p-6">
            <div className="w-full max-w-sm flex flex-col items-center">
                {/* Header */}
                <h1 className="text-4xl font-extrabold mb-8 text-indigo-600 tracking-tight">
                    Mock UPI 💸
                </h1>
                {/* Balance Card */}
                <div className="bg-white shadow-xl rounded-2xl p-7 mb-7 text-center w-full transform transition duration-500 hover:scale-[1.02]">
                    <div className="text-gray-500 text-base font-medium">Your Available Balance</div>
                    <div className="mt-2 text-5xl font-extrabold text-gray-900 flex justify-center items-end">
                        <span className="text-3xl font-bold align-super mr-1">₹</span>
                        {Math.floor(displayBalance)}
                    </div>
                    {lowBalance && (
                        <div className="text-red-500 mt-3 text-sm font-semibold flex items-center justify-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.332 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <span className='tracking-wider'>Low Balance</span>
                        </div>
                    )}
                </div>
                {/* Input Section - Combined and Cleaner */}
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-7 space-y-4 w-full">
                    {/* Receiver Input */}
                    <div className="relative">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Send To</label>
                        <input
                            className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="e.g., Alice"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                        />
                        <span className="absolute left-3 top-9 text-gray-400">👤</span>
                    </div>

                    {/* Sender/Payer Input (Optional/Less critical for a simple mock) */}
                    <div className="relative">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">From</label>
                        <input
                            className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="e.g., You"
                            value={sender}
                            onChange={(e) => setSender(e.target.value)}
                        />
                        <span className="absolute left-3 top-9 text-gray-400">📍</span>
                    </div>

                    {/* Amount Input */}
                    <div className="relative pt-2">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Amount</label>
                        <input
                            type="number"
                            className="w-full p-4 pl-12 rounded-xl text-2xl font-bold text-center border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 transition duration-150"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className="absolute left-3 bottom-3 text-gray-500 text-xl font-bold">₹</span>
                    </div>
                </div>
                {/* Pay Button */}
                <button
                    onClick={sendTx}
                    disabled={Number(amount) <= 0 || Number(amount) > balance}
                    className={`w-full py-4 rounded-xl text-xl font-bold transition duration-300 transform hover:shadow-lg ${
                        Number(amount) <= 0 || Number(amount) > balance
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 active:scale-95"
                    }`}
                >
                    Pay ₹{amount || 0}
                </button>
                {status && (
                    <div className="mt-4 text-center text-sm text-green-600 font-semibold bg-green-50 p-2 rounded-lg w-full">
                        {status}
                    </div>
                )}
                {/* Transactions */}
                <div className="mt-10 w-full">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                        Recent Transactions
                    </h3>
                    <div className="space-y-3">
                        {transactions.length === 0 && (
                            <div className="text-base text-gray-500 text-center py-4 bg-white rounded-xl shadow-sm">
                                No transactions yet
                            </div>
                        )}
                        {transactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="bg-white shadow-md border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:bg-gray-50 transition duration-150"
                            >
                                <div className='flex items-center'>
                                    <div className={`p-2 rounded-full mr-3 ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {tx.amount > 0 ? '⬇️' : '⬆️'}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{tx.receiver}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(tx.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(tx.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`text-lg font-extrabold tracking-wide ${
                                        tx.amount > 0 ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {tx.amount > 0
                                        ? `+₹${tx.amount}`
                                        : `-₹${Math.abs(tx.amount)}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}