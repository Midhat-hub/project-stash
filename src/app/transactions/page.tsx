"use client";

import { useEffect, useState } from "react";

// FIX: Define the type for each transaction
type Tx = {
  id: string;
  amount: number;
  sender: string;
  receiver: string;
  timestamp: string;
};

export default function Transactions() {
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    fetch("/api/clean")
      .then((res) => res.json())
      .then((d) => setTxs(d.transactions || []));
  }, []);

  return (
    <div className="pl-4 md:pl-0">

    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

      <div className="space-y-4">
        {txs.map((t) => (
          <div
            key={t.id}
            className="p-4 bg-white shadow rounded-xl flex justify-between"
          >
            <div>
              <p className="font-semibold">
                {t.sender} → {t.receiver}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(t.timestamp).toLocaleString()}
              </p>
            </div>

            <p className={t.amount < 0 ? "text-red-600" : "text-green-600"}>
              {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
