"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/transactions") // initial load (optional)
      .then((r) => r.json())
      .then((d) => {
        // handle initial data if needed
      });

    const es = new EventSource("/api/stream");
    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed.type === "transaction") {
          setEvents((s) => [parsed.transaction, ...s]);
        }
      } catch {
        // ignore non-json ping
      }
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl">Dashboard</h1>
      <div className="mt-4">
        {events.map((tx: any) => (
          <div key={tx.id} className="p-3 border rounded mb-2">
            <div>{tx.receiver} — ₹{tx.amount}</div>
            <div className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
