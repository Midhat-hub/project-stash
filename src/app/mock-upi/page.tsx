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
  <div className="min-h-screen flex justify-center bg-gray-100 p-6">
    <div className="w-full max-w-md">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Mock UPI 
      </h1>

      {/* Balance Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6 text-center">
        <div className="text-gray-500 text-sm">Available Balance</div>

        <div className="mt-2 text-4xl font-bold text-gray-900">
          ₹{Math.floor(displayBalance)}
        </div>

        {lowBalance && (
          <div className="text-red-600 mt-2 text-sm font-medium">
            ⚠ Low Balance
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-white shadow-md rounded-2xl p-5 mb-6 space-y-3">
        <input
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50"
          placeholder="Enter Sender Name"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />

        <input
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50"
          placeholder="Receiver"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
        />

        <input
          className="w-full p-4 rounded-lg text-xl text-center border border-gray-300 bg-gray-50"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Pay Button */}
      <button
        onClick={sendTx}
        disabled={Number(amount) <= 0 || Number(amount) > balance}
        className={`w-full py-4 rounded-xl text-lg font-semibold transition ${
          Number(amount) <= 0 || Number(amount) > balance
            ? "bg-gray-300 text-gray-500"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow"
        }`}
      >
        Pay ₹{amount || 0}
      </button>

      {status && (
        <div className="mt-4 text-center text-sm text-blue-700 font-medium">
          {status}
        </div>
      )}

      {/* Transactions */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          Recent Transactions
        </h3>

        <div className="space-y-3">
          {transactions.length === 0 && (
            <div className="text-sm text-gray-500">No transactions yet</div>
          )}

          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white shadow-sm border border-gray-200 rounded-xl p-4"
            >
              <div className="flex justify-between">
                <div className="font-medium text-gray-900">{tx.receiver}</div>
                <div
                  className={
                    tx.amount > 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {tx.amount > 0
                    ? `+₹${tx.amount}`
                    : `-₹${Math.abs(tx.amount)}`}
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {new Date(tx.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}