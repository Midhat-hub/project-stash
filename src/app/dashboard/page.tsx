"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

useEffect(() => {
  async function loadData() {
    const res = await fetch("/api/clean");
    const data = await res.json();

    setTransactions(data.transactions || []);
    setBalance(data.balance || 0);
  }

  loadData();
}, []);


  return (
    <div className="p-6 space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          ₹{balance}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div>No transactions found.</div>
          ) : (
            <ul className="space-y-2">
              {transactions.map((t, i) => (
                <li key={i} className="p-2 border rounded">
                  <div>{t.date}</div>
                  <div>{t.category}</div>
                  <div>₹{t.amount}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
