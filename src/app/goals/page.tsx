"use client";

import { useEffect, useState } from "react";

export default function Goals() {
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [weeklyBudget, setWeeklyBudget] = useState("");
  const [food, setFood] = useState("");
  const [shopping, setShopping] = useState("");
  const [transport, setTransport] = useState("");
  const [entertainment, setEntertainment] = useState("");
  const [bills, setBills] = useState("");
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");

  // Load existing prefs
  useEffect(() => {
    fetch("/api/preferences")
      .then((res) => res.json())
      .then((d) => {
        setMonthlyBudget(d.monthlyBudget || "");
        setWeeklyBudget(d.weeklyBudget || "");
        setFood(d.categoryBudgets?.Food || "");
        setShopping(d.categoryBudgets?.Shopping || "");
        setTransport(d.categoryBudgets?.Transport || "");
        setEntertainment(d.categoryBudgets?.Entertainment || "");
        setBills(d.categoryBudgets?.Bills || "");
        setGoalName(d.savingGoalName || "");
        setGoalAmount(d.savingGoalAmount || "");
      });
  }, []);

  async function save() {
    const body = {
      monthlyBudget: Number(monthlyBudget),
      weeklyBudget: Number(weeklyBudget),
      categoryBudgets: {
        Food: Number(food),
        Shopping: Number(shopping),
        Transport: Number(transport),
        Entertainment: Number(entertainment),
        Bills: Number(bills),
      },
      savingGoalName: goalName,
      savingGoalAmount: Number(goalAmount),
      currentSaved: 0,
    };

    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    alert("Preferences Saved Successfully!");
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto">

      <h1 className="text-4xl font-bold">Budget & Saving Goals</h1>

      {/* MONTHLY & WEEKLY BUDGET */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Budget Settings</h2>

        <input
          className="input"
          placeholder="Monthly Budget"
          value={monthlyBudget}
          onChange={(e) => setMonthlyBudget(e.target.value)}
        />

        <input
          className="input mt-2"
          placeholder="Weekly Budget"
          value={weeklyBudget}
          onChange={(e) => setWeeklyBudget(e.target.value)}
        />
      </div>

      {/* CATEGORY BUDGETS */}
      <div className="card">
        <h2 className="text-2xl font-semibold">Category Budgets</h2>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <input className="input" placeholder="Food" value={food} onChange={(e) => setFood(e.target.value)} />
          <input className="input" placeholder="Shopping" value={shopping} onChange={(e) => setShopping(e.target.value)} />
          <input className="input" placeholder="Transport" value={transport} onChange={(e) => setTransport(e.target.value)} />
          <input className="input" placeholder="Entertainment" value={entertainment} onChange={(e) => setEntertainment(e.target.value)} />
          <input className="input" placeholder="Bills" value={bills} onChange={(e) => setBills(e.target.value)} />
        </div>
      </div>

      {/* SAVING GOAL */}
      <div className="card">
        <h2 className="text-2xl font-semibold">Saving Goal</h2>

        <input
          className="input"
          placeholder="Goal Name (MacBook, Phone)"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />

        <input
          className="input mt-2"
          placeholder="Goal Amount"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
        />
      </div>

      {/* SAVE BUTTON */}
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        onClick={save}
      >
        Save Preferences
      </button>
    </div>
  );
}
