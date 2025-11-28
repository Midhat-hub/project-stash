"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // fetch existing data
    fetch("/api/transactions")
      .then((res) => res.json())
      .then(setTransactions);

    // Listen for real-time updates
    const events = new EventSource("/api/stream");

    events.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTransactions((prev) => [...prev, data]);
      } catch {}
    };

    return () => events.close();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Transactions</h1>

      <div className="mt-4 space-y-3">
        {transactions.map((tx, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <p className="font-semibold">{tx.name}</p>
            <p>₹{tx.amount} — {tx.type}</p>
            <p className="text-sm text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
