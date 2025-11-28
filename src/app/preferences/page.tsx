"use client";

import { useState } from "react";

export default function Preferences() {
  const [allowance, setAllowance] = useState("");
  const [goal, setGoal] = useState("");
  const [priority, setPriority] = useState<string[]>([]);


  const categories = ["Food", "Travel", "Shopping", "Entertainment", "Utilities"];

  return (
    <div className="pl-4 md:pl-0">

    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold">Preferences</h1>

      {/* Monthly Allowance */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Monthly Allowance</h2>
        <input
          className="border p-2 rounded w-64"
          placeholder="Enter amount"
          value={allowance}
          onChange={(e) => setAllowance(e.target.value)}
        />
      </div>

      {/* Saving Goal */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Saving Goal</h2>
        <input
          className="border p-2 rounded w-64"
          placeholder="Goal name (Laptop)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>

      {/* Category Priority */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Priority Spending Categories</h2>

        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c} className="flex gap-2">
              <input
                type="checkbox"
                onChange={() => {
                  setPriority((prev) =>
                    prev.includes(c)
                      ? prev.filter((i) => i !== c)
                      : [...prev, c]
                  );
                }}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
    </div>  );
}
