"use client";

import { useState, useEffect } from "react";
import {
  categorizeTransaction,
  analyzePatterns,
  checkBudget,
} from "@/ai/engine";

/**
 * Robust Test UI for the AI engine.
 * This version is defensive:
 *  - ensures imports exist before calling
 *  - creates tx with category initialized
 *  - logs errors to console (browser)
 */

export default function TestAI() {
  const [history, setHistory] = useState<any[]>([]);
  const [prefs, setPrefs] = useState<any | null>(null);

  const [sender, setSender] = useState("You");
  const [receiver, setReceiver] = useState("Zomato");
  const [amount, setAmount] = useState("200");

  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const hRes = await fetch("/api/clean");
        const pRes = await fetch("/api/preferences");

        // Defensive: check responses
        if (!hRes.ok) throw new Error("Failed to load /api/clean: " + hRes.status);
        if (!pRes.ok) throw new Error("Failed to load /api/preferences: " + pRes.status);

        const hJson = await hRes.json();
        const pJson = await pRes.json();

        setHistory(hJson.transactions || []);
        setPrefs(pJson);
        setLoading(false);
      } catch (err: any) {
        console.error("TestAI load error:", err);
        setErrorMsg(String(err?.message || err));
        setLoading(false);
      }
    }
    load();
  }, []);

  function runTest() {
    try {
      if (!prefs) {
        alert("Preferences not loaded yet.");
        return;
      }

      // Defensive tx object (category initialized)
      const tx: any = {
        sender: String(sender || ""),
        receiver: String(receiver || ""),
        amount: -Math.abs(Number(amount || 0)),
        timestamp: new Date().toISOString(),
        category: "Unknown", // <-- initialize to avoid property errors
      };

      // Defensive: ensure functions exist
      if (typeof categorizeTransaction !== "function") {
        throw new Error("categorizeTransaction is not available (check src/ai/engine.ts export).");
      }
      if (typeof analyzePatterns !== "function") {
        throw new Error("analyzePatterns is not available (check src/ai/engine.ts export).");
      }
      if (typeof checkBudget !== "function") {
        throw new Error("checkBudget is not available (check src/ai/engine.ts export).");
      }

      // Agent 1
      const category = categorizeTransaction(tx);
      // Extra defensive: if categorize returns falsy, keep original
      tx.category = category || tx.category;

      // Agent 2
      const patterns = analyzePatterns(history || []);

      // Agent 3
      const budgetCheck = checkBudget(tx, patterns, prefs);

      setResult({
        tx,
        category,
        patterns,
        budgetCheck,
      });

      // also log for easier debugging
      console.log("AI Test Result:", { tx, category, patterns, budgetCheck });
    } catch (err: any) {
      console.error("runTest error:", err);
      setErrorMsg(String(err?.message || err));
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Engine Tester</h1>

      {loading && <div className="card">Loading data...</div>}

      {errorMsg && (
        <div className="card">
          <strong className="text-red-600">Error:</strong>
          <div className="mt-2 text-sm text-gray-700">{errorMsg}</div>
        </div>
      )}

      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">Test New Transaction</h2>

        <input className="input" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Sender" />
        <input className="input mt-2" value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="Receiver" />
        <input className="input mt-2" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />

        <button
          onClick={runTest}
          className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Run AI Evaluation
        </button>
      </div>

      {result && (
        <div className="card">
          <h2 className="text-xl font-bold">AI Output</h2>
          <pre className="bg-gray-100 text-gray-900 p-4 rounded-lg overflow-x-auto text-sm mt-3">
{JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
